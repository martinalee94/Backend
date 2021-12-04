from django import forms
from .models import Page

class PageForm(forms.ModelForm):

    class Meta:
        model = Page
        fields = ['title', 'content', 'feeling', 'score']
 

'''
from django import forms
from .models import Post
class PostForm(forms.ModelForm):

    title = forms.CharField(max_length=100, label="제목")
    content = forms.CharField(widget=forms.Textarea, label="내용")
    feeling = forms.CharField(max_length=80, label="감정상태")
    score = forms.IntegerField(label="감정 점수")
'''