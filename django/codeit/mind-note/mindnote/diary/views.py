from django.shortcuts import render, redirect 
from .models import Page
from .forms import PageForm
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

def page_create(request):
    if request.method == 'POST':
        post_form = PageForm(request.POST)
        new_page = post_form.save()
        return redirect('page-detail', page_id = new_page.id)
    elif request.method == 'GET':
        form = PageForm()
        context = {'form':form}
        return render(request, 'diary/page_form.html', context)