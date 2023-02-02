from webtoons.models import Webtoons
from rest_framework import serializers

class WebtoonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Webtoons
        fields = '__all__'

