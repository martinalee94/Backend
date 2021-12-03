from django import forms

class PostForm(forms.Form):
    title = forms.CharField(max_length = 50, label="제목")
    content = forms.CharField(label="내용", widget=forms.Textarea)
    
