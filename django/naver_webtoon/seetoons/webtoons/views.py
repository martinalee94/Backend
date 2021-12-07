from django.shortcuts import render
from django.views import View

from .models import Webtoons
# Create your views here.
class WebtoonListView(View):
    def get(self, request):
        webtoons = Webtoons.objects.all()
        return render(request, 'webtoons/index.html', {'webtoons':webtoons})