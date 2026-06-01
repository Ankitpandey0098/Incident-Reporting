from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    add_department,
    delete_department,
    get_department_detail,
    incident_timeline,
    update_department,
    update_incident_status_from_email,

    admin_users_list,
    update_user,
    delete_user,
    toggle_user_status,
)
from .views import risk_alerts
from .views import location_risk_alerts
from .views import incident_heatmap
from .views import get_departments
from .views import SignupOTPVerifyView
from .views import (
    IncidentViewSet,
    contact_view,
    contact_list,
    mark_contact_read,
    mark_contact_resolved,
    delete_contact_message,
    ml_test,
    department_analytics,
    incident_category_stats,
    incident_status_stats,
    get_notifications,
    mark_notification_read,
    report_incident_to_department,
)
from .views_auth import (
    get_current_user,
    register_user,
    login_user,
    profile_view,
    get_csrf,
    forgot_password,
    verify_otp,
    reset_password,
)
from .views_auth import forgot_password, verify_otp, reset_password

# Router
router = DefaultRouter()
router.register(r"incidents", IncidentViewSet, basename="incident")

# URL Patterns
urlpatterns = [
    path("", include(router.urls)),

    # Auth
    path("register/", register_user),
    path("login/", login_user),
    path("csrf/", get_csrf),

    # Profile
    path("user/", get_current_user),
    path("profile/", profile_view),

    # ML
    path("ml-test/", ml_test),

    # Contact
    path("contact/", contact_view),
    path("contact-list/", contact_list),
    path(
    "contact/<int:id>/read/",
    mark_contact_read
    ),
    path("login/", login_user, name="login_user"),
    path(
        "contact/<int:id>/resolve/",
        mark_contact_resolved
    ),

    path(
        "contact/<int:id>/delete/",
        delete_contact_message
    ),
    # ================= ADMIN USERS =================

    path(
        "admin/users/",
        admin_users_list,
    ),

    path(
        "admin/users/<int:id>/update/",
        update_user,
    ),

    path(
        "admin/users/<int:id>/delete/",
        delete_user,
    ),

    path(
        "admin/users/<int:id>/toggle-status/",
        toggle_user_status,
    ),
    path("forgot-password/", forgot_password),
    path("verify-otp/", verify_otp),
    path("reset-password/", reset_password),
    # Analytics
    path("analytics/departments/", department_analytics, name="department-analytics"),
    path("analytics/category/", incident_category_stats, name="category-analytics"),
    path("analytics/status/", incident_status_stats, name="status-analytics"),
    path("analytics/timeline/", incident_timeline),
    path("analytics/risk-alerts/", risk_alerts),
    path("analytics/location-risk/", location_risk_alerts),
    path("analytics/heatmap/", incident_heatmap),
    path("departments/", get_departments, name="departments"),   # GET ALL
    path("departments/add/", add_department, name="add-department"),  # POST

    # Notifications
    path('notifications/', get_notifications, name='get-notifications'),
    path('notifications/mark_read/', mark_notification_read, name='mark-notification-read'),
    path(
    "incidents/<int:id>/report/",
    report_incident_to_department,
    name="report-incident-to-department",
    ),
    path("departments/add/", add_department, name="add-department"),

    path(
    "incidents/update-status/<int:incident_id>/<str:new_status>/",
    update_incident_status_from_email,
    ),



    # Password Reset
    path("auth/forgot-password/", forgot_password),
    path("auth/verify-otp/", verify_otp),
    path("auth/reset-password/", reset_password),
    path("departments/<int:id>/", get_department_detail),
    path("departments/update/<int:id>/", update_department),
    path("departments/delete/<int:id>/", delete_department),
    path("signup-verify-otp/", SignupOTPVerifyView.as_view()),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
