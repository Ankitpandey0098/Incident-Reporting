from rest_framework import serializers
from django.contrib.auth.models import User

from backend.incidents.views import CATEGORY_DEPARTMENT_MAP

from .models import Incident, IncidentLog, ContactMessage, UserProfile, Notification
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

import resend

from .models import Department
import hashlib
from datetime import timedelta
from django.utils import timezone
from .models import SignupOTP
import random
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

resend.api_key = settings.RESEND_API_KEY


# ---------------- User Serializer ----------------
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="userprofile.role", read_only=True)
    department = serializers.CharField(
        source="userprofile.department.name",
        read_only=True
    )

    class Meta:
        model = User
        fields = ["id", "username", "role", "department"]

# ---------------- Admin User Serializer ----------------
class AdminUserSerializer(serializers.ModelSerializer):

    role = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "date_joined",
            "role",
            "department",
            "status",
        ]

    def get_role(self, obj):

        try:
            return obj.userprofile.role
        except:
            return "user"

    def get_department(self, obj):

        try:
            if obj.userprofile.department:
                return obj.userprofile.department.name
            return None
        except:
            return None

    def get_status(self, obj):

        if not obj.is_active:
            return "Suspended"

        if obj.is_staff:
            return "Admin"

        try:
            profile = obj.userprofile

            if profile.role == "department":
                return "Department"

            return "Active"

        except:
            return "Active"
# ---------------- Department Serializer ----------------
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"
# ---------------- Incident Log Serializer ----------------
class IncidentLogSerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField()

    class Meta:
        model = IncidentLog
        fields = ["id", "action", "performed_by", "created_at"]


# ---------------- Notification Serializer ----------------
class NotificationSerializer(serializers.ModelSerializer):
    incident_title = serializers.CharField(source="incident.title", read_only=True)
    incident_id = serializers.IntegerField(source="incident.id", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "message",
            "is_read",
            "created_at",
            "incident_title",
            "incident_id",
        ]


# ---------------- Incident Serializer ----------------
class IncidentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    attachment = serializers.FileField(required=False, allow_null=True)
    confidence = serializers.FloatField(read_only=True)
    department = serializers.CharField(required=False, allow_null=True)
    logs = IncidentLogSerializer(many=True, read_only=True)

    class Meta:
        model = Incident
        fields = [
            "id",
            "title",
            "description",
            "category",
            "department",
            "confidence",
            "status",
            "severity",
            "user",
            "attachment",
            "logs",
            "latitude",
            "longitude",
            "created_at",
            "email_sent_count",
            "reported_to_department",
            "last_email_sent_at",
        ]
        read_only_fields = [
            "user",
            "confidence",
            "logs",
            "created_at",
        ]

    # -------- AUTO SET USER AND CREATE LOG --------
    def create(self, validated_data):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            validated_data["user"] = request.user

        incident = super().create(validated_data)

        IncidentLog.objects.create(
            incident=incident,
            action="Incident created",
            performed_by=request.user if request else None,
        )

        # Send email to department when incident is created
        if incident.department:
            try:
                category_key = str(incident.category).strip()

                dept = None

                if incident.department:
                    dept = Department.objects.filter(name=incident.department).first()

                if dept:
                    resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": [dept.email],
                        "subject": f"New Incident Reported: {incident.title}",
                        "html": f"""
                            <h2>New Incident Reported</h2>
                            <p><strong>Department:</strong> {incident.department}</p>
                            <p><strong>Title:</strong> {incident.title}</p>
                            <p><strong>Category:</strong> {incident.category}</p>
                            <p><strong>Description:</strong> {incident.description}</p>
                            <p><strong>Status:</strong> {incident.status}</p>
                        """
                    })

            except Department.DoesNotExist:
                pass


        return incident

    # -------- FIX ATTACHMENT URL --------
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")

        if instance.attachment and request:
            data["attachment"] = request.build_absolute_uri(instance.attachment.url)
        else:
            data["attachment"] = None

        return data

    # -------- UPDATE INCIDENT --------
    def update(self, instance, validated_data):
        request = self.context.get("request")

        old_status = instance.status
        old_category = instance.category

        # Only admin can update status/category
        # Allow admin and department to update status
        role = None
        if request and hasattr(request.user, "userprofile"):
            role = request.user.userprofile.role


        if not (request and (request.user.is_staff or role == "department")):


            validated_data.pop("status", None)

        # Only admin can change category
        if not (request and request.user.is_staff):
            validated_data.pop("category", None)


        updated_instance = super().update(instance, validated_data)

        # -------- CATEGORY CHANGE --------
        if old_category != updated_instance.category:
            category_key = str(updated_instance.category).strip().lower().replace(" ", "_")

            updated_instance.department = CATEGORY_DEPARTMENT_MAP.get(
                category_key,
                "Municipality"
            )
            updated_instance.save(update_fields=["department"])

            IncidentLog.objects.create(
                incident=updated_instance,
                action=f"Category changed to '{updated_instance.category}' (Department auto-updated)",
                performed_by=request.user,
            )

        # -------- STATUS CHANGE --------
        if old_status != updated_instance.status:

            IncidentLog.objects.create(
                incident=updated_instance,
                action=f"Status changed from '{old_status}' to '{updated_instance.status}'",
                performed_by=request.user,
            )

            # Create notification for user
            Notification.objects.create(
                user=updated_instance.user,
                incident=updated_instance,
                message=f"Your incident '{updated_instance.title}' status changed to '{updated_instance.status}'."
            )

        # -------- SEND EMAIL UPDATE --------
        if (old_status != updated_instance.status or old_category != updated_instance.category) \
                and updated_instance.user.email:

            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": updated_instance.user.email,
                "subject": "Update on Your Reported Incident",
                "html": f"""
                    <h2>Incident Updated</h2>

                    <p>Hello {updated_instance.user.username},</p>

                    <p>Your incident has been updated.</p>

                    <p><strong>Incident ID:</strong> {updated_instance.id}</p>
                    <p><strong>Title:</strong> {updated_instance.title}</p>
                    <p><strong>Status:</strong> {updated_instance.status}</p>
                    <p><strong>Category:</strong> {updated_instance.category}</p>
                    <p><strong>Department:</strong> {updated_instance.department}</p>
                """
            })

        return updated_instance


# ---------------- Contact Message Serializer ----------------
class ContactMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "is_read",
            "is_resolved",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

# ---------------- Signup Serializer ----------------
class SignupSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False)
    role = serializers.CharField(write_only=True, required=False, default="user")
    department = serializers.CharField(write_only=True, required=False,  allow_blank=True)
    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "department",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        
        role = validated_data.pop("role", "user")
        department_name = validated_data.pop("department", None)

        # create inactive user
        password = validated_data.get("password")

        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )

        user.set_password(validated_data["password"])
        user.is_active = False
        user.save()
        
        user.is_active = False
        user.save()
        
        otp = str(random.randint(100000, 999999))
        # create profile
        department_obj = None

        if role == "department" and department_name:
            try:
                department_obj = Department.objects.get(
                    name=department_name
                )
            except Department.DoesNotExist:
                department_obj = None

        UserProfile.objects.create(
            user=user,
            phone=phone,
            role=role,
            department=department_obj,
            is_verified=False
        )

        # generate OTP

        otp_obj = SignupOTP.objects.create(
            user=user
        )

        otp_obj.set_otp(otp)
        otp_obj.save()

        # send OTP email
        # send OTP email using Resend
        if user.email:
            try:
                resend.Emails.send({
                    "from": "onboarding@resend.dev",
                    "to": [user.email],
                    "subject": "Verify Your Account",
                    "html": f"""
                        <h2>Incident Platform OTP Verification</h2>

                        <p>Your OTP is:</p>

                        <h1>{otp}</h1>

                        <p>This OTP expires in 10 minutes.</p>
                    """
                })

                print("OTP EMAIL SENT SUCCESSFULLY")

            except Exception as e:
                print("OTP EMAIL ERROR:", e)

        return user

# ---------------- User Profile Serializer ----------------
class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    department = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "phone",
            "city",
            "role",
            "department",
            "profile_image"
        ]

    def get_department(self, obj):
        if obj.department:
            return obj.department.name
        return None

    def get_profile_image(self, obj):
        request = self.context.get("request")

        try:
            if obj.profile_image and hasattr(obj.profile_image, "url"):
                url = obj.profile_image.url
                if request:
                    return request.build_absolute_uri(url)
                return url
        except Exception:
            pass

        return None

class SignupOTPVerifySerializer(serializers.Serializer):
    username = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        otp = data.get("otp")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        otp_obj = SignupOTP.objects.filter(user=user, is_used=False).last()

        if not otp_obj:
            raise serializers.ValidationError("OTP not found")

        if otp_obj.expires_at < timezone.now():
            raise serializers.ValidationError("OTP expired")

        if not otp_obj.check_otp(otp):
            raise serializers.ValidationError("Invalid OTP")

        data["user"] = user
        data["otp_obj"] = otp_obj
        return data