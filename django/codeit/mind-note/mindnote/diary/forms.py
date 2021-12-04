from django import forms
from .models import Page

class PageForm(forms.Form):
    title = forms.CharField(max_length=100, label="제목")
    content = forms.CharField(widget=forms.Textarea, label="내용")
    feeling = forms.CharField(max_length=80, label="감정상태")
    score = forms.IntegerField(label="감정 점수")

'''
from django import forms
from .models import Post
class PostForm(forms.ModelForm):
    
    class Meta:
        model = Post
        fields = ['title', 'content']
        #fields = '__all__' 모델의 모든 컬럼을 불러오기
'''