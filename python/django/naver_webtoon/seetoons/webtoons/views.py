from django.shortcuts import render
from django.views import View
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Webtoons
from webtoons.api.serializers import WebtoonSerializer


# Create your views here.
class WebtoonListView(APIView):
    def get(self, request):
        queryset = Webtoons.objects.all()
        serializer = WebtoonSerializer(queryset, many=True)
        return Response(serializer.data)