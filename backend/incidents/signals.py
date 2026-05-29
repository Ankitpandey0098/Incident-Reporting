from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)


# ❌ IMPORTANT: No email sending here anymore
# This prevents SMTP blocking registration

@receiver(post_save, sender=User)
def user_created_handler(sender, instance, created, **kwargs):
    if created:
        try:
            logger.info(f"User created successfully: {instance.username}")

            # You can trigger OTP email from view later (NOT signal)
            # Example: create OTP record / flag / queue task

        except Exception as e:
            logger.error(f"User signal error: {e}")