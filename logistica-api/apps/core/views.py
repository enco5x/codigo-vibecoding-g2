from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.contrib.auth.models import User, Group, Permission

from apps.core.serializers import (
    UserSerializer,
    CreateUserSerializer,
    UpdateUserSerializer,
    GroupSerializer,
    PermissionSerializer,
)
from apps.core.permissions import IsSuperAdmin


class StandardPagination(PageNumberPagination):
    page_size = 25


@extend_schema(exclude=True)
class LogoutView(APIView):
    def post(self, request):
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


@extend_schema(
    responses={200: UserSerializer},
)
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@extend_schema(
    request=CreateUserSerializer,
    responses={
        200: UserSerializer,
        201: UserSerializer,
    },
)
class UserListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        output = UserSerializer(user)
        return Response(output.data, status=status.HTTP_201_CREATED)


@extend_schema(
    request=UpdateUserSerializer,
    responses={
        200: UserSerializer,
        204: None,
    },
)
class UserDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        return User.objects.get(pk=pk)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, pk):
        user = self.get_object(pk)
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        output = UserSerializer(user)
        return Response(output.data)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    request=GroupSerializer,
    responses={
        200: GroupSerializer,
        201: GroupSerializer,
    },
)
class GroupListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(
    request=GroupSerializer,
    responses={
        200: GroupSerializer,
        204: None,
    },
)
class GroupDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        return Group.objects.get(pk=pk)

    def get(self, request, pk):
        group = self.get_object(pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)

    def patch(self, request, pk):
        group = self.get_object(pk)
        serializer = GroupSerializer(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        group = self.get_object(pk)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(responses={200: PermissionSerializer(many=True)})
class PermissionListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        permissions = Permission.objects.all()
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)
