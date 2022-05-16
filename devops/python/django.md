---
title: django rest 查找
date: 2020-02-25 10:21:28
tags: django
author: 相飞
comments:
- true
categories:
- django
---



# 说明
- 查找get 改成post

```python
#!/usr/bin/python 
# -*- coding: utf-8 -*-


'''
Created on 2018年5月2日

@author: xiangfei
'''
from rest_framework.filters import SearchFilter
from  django_filters.rest_framework import  DjangoFilterBackend
from django.template import loader
class PostSearchFilter(SearchFilter):
    
    search_param = 'search_text'
    
    def get_search_terms(self, request):
        """
        Search terms are set by a ?search=... query parameter,
        and may be comma and/or whitespace delimited.
        """
        params = request.data.get(self.search_param, '')
        return params.replace(',', ' ').split()
    
class POSTDjangoFilterBackend(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        filter_class = self.get_filter_class(view, queryset)

        if filter_class:
            return filter_class(request.data, queryset=queryset, request=request).qs

        return queryset

    def to_html(self, request, queryset, view):
        filter_class = self.get_filter_class(view, queryset)
        if not filter_class:
            return None
        filter_instance = filter_class(request.data, queryset=queryset, request=request)

        template = loader.get_template(self.template)
        context = {
            'filter': filter_instance
        }

        return template.render(context, request)

class ProjectFilter(django_filters.rest_framework.FilterSet):

    dateold = django_filters.NumberFilter(name="date_joined", lookup_expr='gte')
    datenew = django_filters.NumberFilter(name="date_joined", lookup_expr='lte')

    class Meta:
        model = ProjectRecord
        fields = ('dateold', 'datenew', 'organizational_id', 'department_id')

# 调用


class  ServerListView(ListModelMixin, GenericAPIView):

    queryset = Server.objects.all()
    serializer_class = ServerListSerializer
    #数据测试需要request.data 组装
    filter_backends = (PostSearchFilter,)
    search_fields = ('name' , 'outterip' ,'innerip' , 'status' ,'usage','env','config','id')
    pagination_class = ServerPagination
    authentication_classes = (TokenAuthentication, )
    
    @check_permission('server.view_server')
    @list_permission
    def post(self , request):
        
        return self.list(request)


#@authentication()
class ProjectViewset(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    #permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    #authentication_classes = (JSONWebTokenAuthentication, SessionAuthentication)
    queryset = ProjectRecord.objects.all().order_by('id')
    pagination_class = AllPagination
    serializer_class = ProjectRecordSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_class = ProjectFilter
    search_fields = ('project_name',)

```
