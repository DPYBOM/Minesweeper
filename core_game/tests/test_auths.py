from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class AuthTests(TestCase):

    def setUp(self):
        self.username = "testuser"
        self.password = "StrongPass123!"
        self.user = User.objects.create_user(username=self.username, password=self.password)

    # Registration
    def test_register_page_status_code(self):
        response = self.client.get(reverse("register"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "register.html")

    def test_register_rejects_duplicate_username(self):
        response = self.client.post(reverse("register"), {
            "username": self.username, 
            "password": self.password,
            },
            follow=True, 
        )
        self.assertContains(response, "Username already exists")

    def test_register_creates_user(self):  # test of register view logic -> setUp user cannot be used due to duplication
        response = self.client.post(reverse("register"), {
            "username": "newuser",
            "password": "AnotherPass123!"  
            },
            follow=True,
        )
        self.assertRedirects(response, reverse("login"))
        self.assertTrue(User.objects.filter(username="newuser").exists())
        self.assertContains(response, "Account created. Login now")

    # Login
    def test_login_page_status_code(self):
        response = self.client.get(reverse("login"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "login.html")

    def test_login_success_redirects(self):
        response = self.client.post(reverse("login"), {
            "username": self.username,
            "password": self.password
        })
        self.assertRedirects(response, reverse("multiplayer"))

    def test_login_failure_stays_on_page(self):
        response = self.client.post(reverse("login"), {
            "username": self.username, 
            "password": "WrongPassword!"
            },
            follow=True # To check the response, follow needs to be True, maybe I should've followed default django routing for login, instead of 302 - redirect?
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Invalid login credentials")

    # Multiplayer page - 200
    def test_multiplayer_requires_login(self):
        response = self.client.get(reverse("multiplayer"))
        self.assertRedirects(response, f"{reverse("login")}?next={reverse("multiplayer")}")

    def test_multiplayer_accessible_after_login(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.get(reverse("multiplayer"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "multiplayer-game.html")


