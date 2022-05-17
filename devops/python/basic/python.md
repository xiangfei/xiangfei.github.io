


## 概述

- Python元编程有两种方法，一是采用类似“装饰器”的工具对基本元素（例如函数、类、类型）内审和对其进行实时创建和修改，二是运用类型"元类"的方式对类实例的创建过程进行修改，甚至于允许重新设计Python面对对象编程范式的实现


## 装饰器


```python

def doSomethingBeforeHi(func):
    print("I am doing some boring work before executing hi()")
    print(func())


from functools import wraps
 
def a_new_decorator(a_func):
    @wraps(a_func)
    def wrapTheFunction():
        print("I am doing some boring work before executing a_func()")
        a_func()
        print("I am doing some boring work after executing a_func()")
    return wrapTheFunction
 

def logit(logfile='out.log'):
    def logging_decorator(func):
        @wraps(func)
        def wrapped_function(*args, **kwargs):
            log_string = func.__name__ + " was called"
            print(log_string)
            # 打开logfile，并写入内容
            with open(logfile, 'a') as opened_file:
                # 现在将日志打到指定的logfile
                opened_file.write(log_string + '\n')
            return func(*args, **kwargs)
        return wrapped_function
    return logging_decorator


```

> wraps 作用
- 在类装饰器中使用闭包会导致生成的对象不再是被装饰的类的实例，二是在装饰器函数创建的子类的实例，这会影响\__name__和\__doc__等属性，在上篇我们使用@wraps装饰器对函数装饰器进行操作让问题得到解决，但在类装饰器中这一方法无效


## meta

---

### type



```python
type(obj) # 查看对象类型
type(name, bases, dict) #用来创建类
```


### metaclass

```python
class FirstMetaClass(type):
    def __new__(cls, name, bases, attrs):
        return super().__new__(cls,name,bases,attrs)
# cls 类
# name  class instance ,个人理解
# bases (object ,)
# attrs 类属性
```

### 动态创建function

```python
module_code = compile('def foobar(): return "foobar"', '', 'exec')
function_code = [c for c in module_code.co_consts if isinstance(c, types.CodeType)][0]
foobar = types.FunctionType(function_code, {})
print foobar()

```

### 动态method

```python
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


```
