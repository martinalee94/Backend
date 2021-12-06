from django import forms

from .validators import validate_symbols
from .models import Post
from django.core.exceptions import ValidationError

class PostForm(forms.ModelForm):
    memo = forms.CharField(max_length=80, validators=[validate_symbols])
    class Meta:
        model = Post
        fields = ['title', 'content']
        #fields = '__all__' 모델의 모든 컬럼을 불러오기

    def clean_title(self): #하나의 필드만 유효성 검증을 할 수 있음
        title = self.cleaned_data['title'] #유효성 검증을 거치지 않은 데이터가 들어가있음
        if '*' in title:
            raise ValidationError('*은 포함될 수 없습니다.')
        return title