from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.contrib import messages
from django.conf import settings
from django.core.exceptions import ValidationError
from .models import *
import re

def home_view(request):
    return render(request, template_name="home.html")

def guest_view(request):
    return render(request, template_name="guest-game.html")

@login_required
def multiplayer_view(request):
    return render(request, "multiplayer-game.html")

def register_view(request):
    # return render(request, "register.html")
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        user_data_has_error = False

        if User.objects.filter(username=username).exists():
            user_data_has_error = True
            messages.error(request, "Username already exists")

        # Django already does length check and check if name==password by validate_password, thus skipped

        # Check complexity not covered by Django
        if not re.search(r"[A-Z]", password):
            user_data_has_error = True
            messages.error(request, "Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", password):
            user_data_has_error = True
            messages.error(request, "Password must contain at least one lowercase letter")

        if not re.search(r"\d", password):
            user_data_has_error = True
            messages.error(request, "Password must contain at least one digit")

        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
            user_data_has_error = True
            messages.error(request, "Password must contain at least one special character")

        try:
            validate_password(password)
        except ValidationError as ve:
            user_data_has_error = True
            for error in ve:
                messages.error(request, error)

        if user_data_has_error:
            return redirect("register")
        else:
            new_user = User.objects.create_user(
                username=username,
                password=password
            )
            messages.success(request, "Account created. Login now")
            return redirect("login")

    return render(request, "register.html")

def login_view(request):
    # return render(request, "login.html")

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            return redirect("multiplayer")
        
        else:
            messages.error(request, "Invalid login credentials")
            return redirect("login")

    return render(request, "login.html")

def logout_view(request):

    logout(request)

    return redirect("home")
