from django import forms

class LoginForms(forms.Form):
    name = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)