from django.shortcuts import render
from .models import Page

# Create your views here.
def page_list(request):
    pages = Page.objects.all()
    context = {'pages':pages}
    return render(request, 'diary/page_list.html', context)