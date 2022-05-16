---
title: rails api 文档
date: 2020-04-09 16:03:55
author: 相飞
comments:
- true
categories:
- rails


---




#### 创建markdown文档

扩展rails apipie

- rails apipie



```ruby
app/doc
module BaseDoc
  include Apipie::DSL::Concern
  extend Apipie::DSL::Concern

  def check_token
    send(:include, Header::TokenDoc)
  end

  def check_permission
    send(:include, Header::DomainDoc)
  end

  def check_paginate
    send(:include, Header::PaginateDoc)
  end

  def defaults(&block)
    @defaults = block
  end

  def param_group_common_base
    param :id, Integer, :desc => "id", :required => true
    param :created_at, String, :desc => "创建时间", :required => true
    param :updated_at, String, :desc => "修改时间", :required => true
  end



  def doc_for(action_name, &block)
    formats ["json"]
    instance_eval(&block)
    instance_eval(&@defaults) if @defaults
    api_version @namespace_name if @namespace_name
    internelerror
    notfound
    nopermission
    define_method(action_name) do
    end
  end

  def jsonlistreturn(desc = "返回列表", &block)
    returns :code => 200, :desc => desc do
      property :code, :number, :desc => "200", :required => true
      property :message, String, :desc => "返回全部数据", :required => true
      property :data, :array_of => Array do
        instance_eval(&block)
      end
    end
  end

  def singlejsonreturn(desc = "返回单个数据", &block)
    returns :code => 200, :desc => desc do
      property :code, :number, :desc => "200", :required => true
      property :message, String, :desc => "返回单个数据", :required => true
      property :data, :array_of => Hash do
        instance_eval(&block)
      end
    end
  end

  def paginatejsonlistreturn(desc = "返回分页数据", &block)
    returns :code => 201, :desc => desc do
      property :code, :number, :desc => "200", :required => true
      property :message, String, :desc => "分页返回数据", :required => true
      property :data, :array_of => Array do
        instance_eval(&block)
      end
      property :total_number, Integer, :desc => "总条数", :required => true
      property :current_page, Integer, :desc => "当前页", :required => true
      property :total_page, Integer, :desc => "总页数", :required => true
      property :limit, Integer, :desc => "返回个数", :required => true
    end
  end

  def internelerror
    returns :code => 500, :desc => "服务器错误" do
      property :code, :number, :desc => "500", :required => true
      property :message, String, :desc => "服务器内部错误", :required => true
      property :data, String, :desc => "详细", :required => true
    end
  end

  def nopermission
    returns :code => :unprocessable_entity, :desc => "422错误" do
      property :code, :number, :desc => "422", :required => true
      property :message, String, :desc => "html 422 错误", :required => true
      property :data, String, :desc => "详细", :required => true
    end
  end

  def notfound
    returns :code => 404, :desc => "Fleas were discovered on the pet" do
      property :code, :number, :desc => "404", :required => true
      property :message, String, :desc => "找到到数据", :required => true
      property :data, String, :desc => "详细", :required => true
    end
  end



end

# app/doc/header/token_doc.rb
module Header::TokenDoc
  def self.included(base)
    base.instance_eval do
      header "Authorization", "Bearer 123456" , "Bearer 认证"
      error code: 401, desc: "认证失败"

      returns :code => 401, :desc => "需要登陆" do
        property :code, :number , :desc => "401", :required => true
        property :message, String, :desc => "需要登录", :required => true
        property :data, String, :desc => "详细", :required => true
      end
    end
  end
end

# app/doc

module DomainsDoc
  extend BaseDoc
  def self.superclass
    DomainsController
  end

  resource_description do
    resource_id "Domains"
    formats [:json]
    api_versions "public"
  end

  def_param_group :domain do
    param :name, String, :desc => "域名", :required => true
    param :description, String, :desc => "描述", :required => true
    param :superuser, Array, :desc => "超级用户"
  end

  doc_for :show do
    check_permission
    check_token
    api :GET, "/domains/:id", "查看单个域"
    param_group :domain
    singlejsonreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
  end
  doc_for :destroy do
    check_permission
    check_token
    api :DELETE, "/domains/:id", "删除域"
    singlejsonreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
  end
  doc_for :update do
    check_permission
    check_token
    api :PUT, "/domains/:id", "修改域"
    param_group :domain
    singlejsonreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
  end
  doc_for :create do
    check_permission
    check_token
    api :POST, "/domains", "创建域"
    param_group :domain
    singlejsonreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
  end

  doc_for :index do
    check_permission
    check_token
    api :GET, "/domains", "查看域列表"
    paginatejsonlistreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
    jsonlistreturn do
      param_group :domain
      param :id, Integer, :desc => "域id", :required => true
      param :created_at, String, :desc => "创建时间", :required => true
      param :updated_at, String, :desc => "修改时间", :required => true
    end
  end
end


```

- lib task 扩展
 - lib/tasks/apipie.rake 
   

```ruby
# -*- coding: utf-8 -*-
require "fileutils"

namespace :apipie do
  desc "创建markdown文档 , 通过json api 翻译"
  task :markdown, [:version] => :environment do |t, args|
    with_loaded_documentation do
      args.with_defaults(:version => Apipie.configuration.default_version)
      doc = Apipie.to_json(args[:version], nil, nil, nil)
      generate_markdown_project_page doc
    end
  end

  desc "创建wiki文档"
  task :wiki, [:version] => :environment do |t, args|
    with_loaded_documentation do
      raise "暂时不支持"
    end
  end

  def generate_markdown_project_page(doc)
    FileUtils.mkdir_p(doc_absolute_dir) unless File.exists?(doc_absolute_dir)
    generate_project_index_markdown doc[:docs]
  end

  def generate_project_index_markdown(info)
    file = "index.md"

    File.open("#{doc_absolute_dir}/#{file}", "w") do |io|
      io.puts "### 项目:    **#{info[:name]}**"
      io.puts "### Info: #{strip_html(info[:info])} "
      info[:resources].each do |controllername, json_value|
        #io.puts " - [#{controllername}](#{doc_relative_dir}/#{controllername}/index.md})  #{json_value[:short_description]}"
        io.puts " - #{controllername} #{json_value[:short_description]}"
        generate_controller_index_markdown json_value, controllername
      end
    end
  end

  def generate_controller_index_markdown(json_value, controllername)
    controller_index_dir = File.join(doc_absolute_dir, controllername)
    filename = "index.md"
    FileUtils.mkdir_p(controller_index_dir) unless File.exists?(controller_index_dir)
    File.open("#{controller_index_dir}/#{filename}", "w") do |io|
      io.puts "#### #{json_value[:short_description]}"
      io.puts ""
      json_value[:methods].each do |method|
        method[:apis].each do |api|
          #io.puts " - [#{method[:name]}](#{doc_relative_dir}/#{controllername}/#{method[:name]}/index.md})  #{api[:short_description]}"
          io.puts "- #{method[:name]} #{api[:short_description]}"
          break
        end
      end
    end
    generate_controller_action_markdown json_value, controllername
  end

  def generate_controller_action_markdown(resource, controllername)
    controller_index_dir = File.join(doc_absolute_dir, controllername)
    FileUtils.mkdir_p(controller_index_dir) unless File.exists?(controller_index_dir)
    resource[:methods].each do |method|
      action_index_dir = File.join(controller_index_dir, method[:name])
      FileUtils.mkdir_p(action_index_dir) unless File.exists?(action_index_dir)
      File.open("#{action_index_dir}/index.md", "w") do |io|
        method[:apis].each do |api|
          io.puts "#### action"
          io.puts " - #{method[:name]}"
          io.puts ""
          io.puts "#### URL"
          io.puts " - #{api[:api_url]} "
          io.puts ""
          io.puts "#### 请求方法"
          io.puts " - #{api[:http_method]}"
          io.puts ""
          io.puts "#### formats "
          io.puts " - #{method[:formats]}"
          io.puts "#### 描述"
          io.puts " - #{api[:short_description]}"
          io.puts ""
          io.puts "#### 请求Header "
          io.puts "| 参数名  | 是否必须   | 默认值  |  描述  |"
          io.puts "| :----- | :---- | :----- | :----- |"
          resource[:headers] ||= []
          (method[:headers] + resource[:headers]).uniq.each do |param|
            io.puts "| #{param[:name]} |  true  | #{param[:description]} | #{param[:options]} | "
          end
          io.puts ""
          io.puts "#### 请求参数"
          io.puts ""
          io.puts "| 参数名  | 是否必须   |  参数类型  |  描述  | 校验 |"
          io.puts "| :----- | :---- | :----- | :----- | :----- |"
          method[:params].each do |param|
            recuirsvice_add(io, param)
          end
          io.puts ""

          io.puts "#### 请求 example"
          io.puts "```json"
          method[:examples].each do |example|
            begin
              ex = JSON.load(example)
            rescue
              ex = example
            end
            io.puts JSON.pretty_generate(ex)
            io.puts ""
          end
          io.puts "```"
          io.puts ""
          method[:returns].each do |returnjson|
            io.puts "#### 返回参数"
            #io.puts " - http code  #{returnjson[:code]} "
            #io.puts " - 描述 #{returnjson[:description]}"
            io.puts " - is_array #{returnjson[:is_array]}"
            io.puts ""
            io.puts "| 参数名  | 是否必须   |  参数类型  |  描述  | 校验 |"
            io.puts "| :----- | :---- | :----- | :----- | :----- |"
            returnjson[:returns_object].each do |obj|
              recuirsvice_add(io, obj)
            end
            io.puts ""
          end
          io.puts ""
          io.puts "### 错误返回"
          io.puts "| code  | description   | metadata  |"
          io.puts "| :----- | :---- | :----- |"
          method[:errors].each do |error|
            io.puts "| #{error[:code]}  | #{error[:description]}   | #{error[:metadata]}  |"
          end
        end
        io.puts ""
        io.puts "---"
        io.puts ""
      end
    end
  end

  def recuirsvice_add(io, obj, i = 0)
    intent = "&nbsp;&nbsp;&nbsp;&nbsp;" * i
    io.puts "| #{intent}#{obj[:name]} | #{obj[:required]} | #{obj[:expected_type]} | #{strip_html(obj[:description])} | #{obj[:validator]} |"
    params = obj[:params]
    if params
      if params.kind_of? Hash
        i = i + 1
        recuirsvice_add(io, params, i)
      elsif params.kind_of? Array
        i = i + 1
        params.each do |param|
          recuirsvice_add(io, param, i)
        end
      else
      end
    end
  end

  def strip_html(string)
    regex = "<p>(.*)</p>"
    result = string.match regex
    if result
      return result[1]
    else
      return string
    end
  end

  def doc_relative_dir
    doc_base = File.join(Apipie.configuration.doc_path)
  end

  def doc_absolute_dir
    @base_dir ||= File.join(::Rails.root, Apipie.configuration.doc_path)
  end
end


```

- 调用


```ruby
 class AppliactionController
   include BaseDoc
 end

```

- 实现参考

> https://ilyabylich.svbtle.com/apipie-amazing-tool-for-documenting-your-rails-api
 

