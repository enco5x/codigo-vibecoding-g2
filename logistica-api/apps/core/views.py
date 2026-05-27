from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema


@extend_schema(exclude=True)
class LogoutView(APIView):
    def post(self, request):
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
