from django.shortcuts import render
from allauth.account.views import PasswordChangeView
from django.urls import reverse
# Create your views here.
def index(request):
    return render(request, 'coplate/index.html')

#비밀번호 변경 성공후 이동하는 페이지를 오버라이딩함
class CustomPasswordChangeView(PasswordChangeView):
    def get_success_url(self) -> str:
        return reverse('index')
