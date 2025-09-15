from django.test import SimpleTestCase, TestCase
from django.urls import reverse
from django.contrib.auth.models import User


class HomePageTests(SimpleTestCase):
    def setUp(self):
        self.response = self.client.get(reverse("home"))

    #status_code=200 is default for assertContains
    def test_homepage_contains_play_as_guest_and_player(self):
        self.assertContains(self.response, "Play as Guest")
        self.assertContains(self.response, "Play as Player")

    def test_homepage_uses_correct_template(self):
        self.assertTemplateUsed(self.response, "home.html")


class GuestPageTests(SimpleTestCase):
    def setUp(self):
        self.response = self.client.get(reverse("guest_game"))

    def test_guestpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_homepage_uses_correct_template(self):
        self.assertTemplateUsed(self.response, "guest-game.html")


class MultiplayerMenuTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="SCI43281p;xla")

    def test_menu_requires_login(self):
        """Menu should redirect to login if user not logged in"""
        response = self.client.get(reverse("multiplayer"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/login", response.url)

    def test_menu_loads_for_authenticated_user(self):
        self.client.login(username="testuser", password="SCI43281p;xla")
        response = self.client.get(reverse("multiplayer"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "multiplayer-game-menu.html")

    def test_logout_redirects(self):
        """Logout should log out user and redirect to home"""
        self.client.login(username="testuser", password="SCI43281p;xla")
        response = self.client.get(reverse("logout"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/", response.url)

        # After logout, menu should redirect to home
        response = self.client.get(reverse("multiplayer"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/", response.url)