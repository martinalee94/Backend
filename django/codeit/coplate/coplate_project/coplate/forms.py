from django import forms

from .models import User

class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['nickname'] #기본 유저모델외에 내가 추가한 필드 추가
    
    def signup(self, request, user):
        user.nickname = self.cleaned_data['nickname'] #form에 기입된 데이터는 cleaned-data로 가져옴
        user.save()