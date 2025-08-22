from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User


class RegisterPasswordIntegrationTests(TestCase):

    def test_rejects_password_without_uppercase(self):
        response = self.client.post(reverse("register"), {
            "username": "user1",
            "password": "weakpassword123!",
            },
            follow=True,    
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user1").exists())
        self.assertContains(response, "Password must contain at least one uppercase letter.")

    def test_rejects_password_without_digit(self):
        response = self.client.post(reverse("register"), {
            "username": "user2",
            "password": "WeakPassword!",
            },
            follow=True,
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user2").exists()) 
        self.assertContains(response, "Password must contain at least one digit.")

    def test_rejects_password_without_special_char(self):
        response = self.client.post(reverse("register"), {
            "username": "user3",
            "password": "WeakPassword123",
            },
            follow=True,    
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user3").exists())
        self.assertContains(response, "Password must contain at least one special character.")

    def test_rejects_password_too_short(self):
        response = self.client.post(reverse("register"), {
            "username": "user4",
            "password": "S1!",
            },
            follow=True,
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user4").exists())
        self.assertContains(response, "This password is too short. It must contain at least 12 characters.") #hardcoded based on the settings.py

    def test_rejects_common_password(self):
        response = self.client.post(reverse("register"), {
            "username": "user5",
            "password": "password123",
            },
            follow=True,
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user5").exists())
        self.assertContains(response, "This password is too common.")

    def test_rejects_only_numeric_password(self):
        response = self.client.post(reverse("register"), {
            "username": "user6",
            "password": "856546697456",
            },
            follow=True,
        )
        self.assertRedirects(response, reverse("register"))
        self.assertFalse(User.objects.filter(username="user6").exists())
        self.assertContains(response, "This password is entirely numeric.")