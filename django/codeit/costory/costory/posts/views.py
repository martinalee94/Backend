from django.shortcuts import render, redirect

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
    if request.method == "POST":
        post_form = PostForm(request.POST)
        if post_form.is_valid():
            new_post = post_form.save()
            return redirect('post-detail', post_id = new_post.id)
    elif request.method == "GET":
        post_form = PostForm()
    
    return render(request, 'posts/post_form.html', {'form': post_form})

def post_update(request, post_id):
    post = Post.objects.get(id = post_id)
    if request.method == 'GET':
        post_form = PostForm(instance = post) #기존 post의 정보가 새로 보내주는 post폼에 붙어서 간다
        context = {'form': post_form}
        return render(request, 'posts/post_form.html', context)
    elif request.method == 'POST':
        post_form = PostForm(request.POST, instance = post) #기존 정보와 새로운 정보를 묶음
        if post_form.is_valid():
            post_form.save()
            return redirect('post-detail', post_id = post.id)

def post_delete(request, post_id):
    post = Post.objects.get(id = post_id)
    if request.method == 'POST':
        post.delete()
        return redirect('post-list')
    elif request.method =="GET":
        return render(request, 'posts/post_confirm_delete.html', {'post':post})

def index(request):
    return redirect('post-list')