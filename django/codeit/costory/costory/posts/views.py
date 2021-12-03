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
        title = request.POST['title']
        content = request.POST['content']
        new_post = Post(title = title, content = content)
        new_post.save()
        return redirect('post-detail', post_id = new_post.id)
    elif request.method == "GET":
        post_form = PostForm()
        context = {'form': post_form}
        return render(request, 'posts/post_form.html', context)