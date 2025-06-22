from django.test import SimpleTestCase
from django.urls import reverse


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
        self.assertTemplateUsed(self.response, "guest_game.html")