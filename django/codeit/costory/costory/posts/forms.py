from django import forms
from .models import Post
class PostForm(forms.ModelForm):
    
    class Meta:
        model = Post
        fields = ['title', 'content']
        #fields = '__all__' 모델의 모든 컬럼을 불러오기

