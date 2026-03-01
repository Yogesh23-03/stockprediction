from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,min_length=8,style={'input_type':'password'})#the password sld not be seen or retrived it sld only be post or put request
    class Meta:
        model = User
        fields =[ 'username','email' ,'password']

    def create(self, validated_data):
        user = User.objects.create_user(#using createuser method to create user and hash the password but with create method the password will be stored in plain text and password without hashing
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        #Token.objects.create(user=user)
        return user