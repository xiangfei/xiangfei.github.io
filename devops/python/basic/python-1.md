



##  蜜糖方法

- ruby 
 -  method_missing

- python 

 - \__getattr__  , \__getattribute__


## 装饰器

- python 

```python
  def record_method(f):
    def wrapper(*args, **kwargs):
      puts "xxxxxxxxxxx"
      f(*args, **kwargs)
    return wrapper

```
- ruby  

```

def with_record_log(method, *args)
  puts "xxxxxx"
  self.send method , *args
  puts "yyyyyyyy"
end

```

## 动态方法

- python

```python
# class method
import types
 
class Person(object):
    country = 'china'
    def __init__(self,name):
        self.name = name
 
@classmethod
def run(cls):
    print('%s在奔跑' % cls.country)
 
Person.run = run
Person.run()

#instance method

import types
class Person(object):
    def __init__(self,name):
        self.name = name
 
def run(self):
    print('%s在奔跑' % self.name)
 
p1 = Person('p1')
p1.run = types.MethodType(run,p1)
 
p1.run()

# static method


import types
 
class Person(object):
    country = 'china'
    def __init__(self,name):
        self.name = name
 
@staticmethod
def run():
    print('在奔跑')
 
Person.run = run
Person.run()


# function

from ast import *
import types

function_ast = FunctionDef(
    name='foobar',
    args=arguments(args=[], vararg=None, kwarg=None, defaults=[]),
    body=[Return(value=Num(n=42, lineno=1, col_offset=0), lineno=1, col_offset=0)],
    decorator_list=[],
    lineno=1,
    col_offset=0
)
module_ast = Module(body=[function_ast])
module_code = compile(module_ast, "<>", "exec")
function_code = [c for c in module_code.co_consts if isinstance(c, types.CodeType)][0]
foobar = types.FunctionType(function_code, {})
print foobar()

# 2
module_code = compile('def foobar(): return "foobar"', '', 'exec')
function_code = [c for c in module_code.co_consts if isinstance(c, types.CodeType)][0]
foobar = types.FunctionType(function_code, {})
print foobar()
```

- ruby

```ruby

# instance method

class A 

end

A.instance_eval do 


end

# class method 

A.class_eval do

end

# open class 

class A 

end
# 定义方法 

define_method :xxx do |args|

end

```
## 动态类

- python

```python

SomeClass = type('SomeClass', (), {})

```

- ruby

```ruby

 A =   Class.new do 

  end

```
