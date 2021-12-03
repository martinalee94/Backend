from django.shortcuts import render

from .forms import PostForm
from .models import Post

# Create your views here.
def post_list(request):
    posts = Post.objects.all()
    context = {'posts':posts}
    return render(request, 'posts/post_list.html', context)

def post_detail(request, post_id):
    post = Post.objects.get(id = post_id)
    context = {'post':post}
    return render(request, 'posts/post_detail.html', context)

def post_create(request):
    post_form = PostForm()
    context = {'form': post_form}
    return render(request, 'posts/post_form.html', context)