from django.shortcuts import render
from .models import Page

# Create your views here.
def page_list(request):
    pages = Page.objects.all()
    context = {'pages':pages}
    return render(request, 'diary/page_list.html', context)

def page_detail(request, page_id):
    page = Page.objects.get(id=page_id)
    context = {'page':page}
    return render(request, 'diary/page_detail.html', context)

def info(request):
    return render(request, 'diary/info.html')