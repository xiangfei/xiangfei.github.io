## 目的
- 工厂方法模式是一种创建型设计模式， 其在父类中提供一个创建对象的方法， 允许子类决定实例化对象的类型


## 工厂方法模式适合应用场景


### 当你在编写代码的过程中， 如果无法预知对象确切类别及其依赖关系时， 可使用工厂方法。

- 工厂方法将创建产品的代码与实际使用产品的代码分离， 从而能在不影响其他代码的情况下扩展产品创建部分代码。

- 如果需要向应用中添加一种新产品， 你只需要开发新的创建者子类， 然后重写其工厂方法即可。


###  如果你希望用户能扩展你软件库或框架的内部组件， 可使用工厂方法


### 如果你希望复用现有对象来节省系统资源， 而不是每次都重新创建对象， 可使用工厂方法。


### 实现方式
- 让所有产品都遵循同一接口。 该接口必须声明对所有产品都有意义的方法。

- 在创建类中添加一个空的工厂方法。 该方法的返回类型必须遵循通用的产品接口。

- 在创建者代码中找到对于产品构造函数的所有引用。 将它们依次替换为对于工厂方法的调用， 同时将创建产品的代码移入工厂方法。

- 你可能需要在工厂方法中添加临时参数来控制返回的产品类型。

- 工厂方法的代码看上去可能非常糟糕。 其中可能会有复杂的 switch分支运算符， 用于选择各种需要实例化的产品类。 但是不要担心， 我们很快就会修复这个问题。

- 现在， 为工厂方法中的每种产品编写一个创建者子类， 然后在子类中重写工厂方法， 并将基本方法中的相关创建代码移动到工厂方法中。

- 如果应用中的产品类型太多， 那么为每个产品创建子类并无太大必要， 这时你也可以在子类中复用基类中的控制参数。

- 例如， 设想你有以下一些层次结构的类。 基类 邮件及其子类 航空邮件和 陆路邮件 ； ​ 运输及其子类 飞机, 卡车和 火车 。 ​ 航空邮件仅使用 飞机对象， 而 陆路邮件则会同时使用 卡车和 火车对象。 你可以编写一个新的子类 （例如 火车邮件 ） 来处理这两种情况， 但是还有其他可选的方案。 客户端代码可以给 陆路邮件类传递一个参数， 用于控制其希望获得的产品。

- 如果代码经过上述移动后， 基础工厂方法中已经没有任何代码， 你可以将其转变为抽象类。 如果基础工厂方法中还有其他语句， 你可以将其设置为该方法的默认行为。


##  工厂方法模式优缺点

### 优点

- 你可以避免创建者和具体产品之间的紧密耦合。
- 单一职责原则。 你可以将产品创建代码放在程序的单一位置， 从而使得代码更容易维护。
- 开闭原则。 无需更改现有客户端代码， 你就可以在程序中引入新的产品类型。



### 缺点

-  应用工厂方法模式需要引入许多新的子类， 代码可能会因此变得更复杂。 最好的情况是将该模式引入创建者类的现有层次结构中。



## demo


### ruby

#### main.rb: 概念示例


```ruby
# The Creator class declares the factory method that is supposed to return an
# object of a Product class. The Creator's subclasses usually provide the
# implementation of this method.
class Creator
  # Note that the Creator may also provide some default implementation of the
  # factory method.
  def factory_method
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  # Also note that, despite its name, the Creator's primary responsibility is
  # not creating products. Usually, it contains some core business logic that
  # relies on Product objects, returned by the factory method. Subclasses can
  # indirectly change that business logic by overriding the factory method and
  # returning a different type of product from it.
  def some_operation
    # Call the factory method to create a Product object.
    product = factory_method

    # Now, use the product.
    result = "Creator: The same creator's code has just worked with #{product.operation}"

    result
  end
end

# Concrete Creators override the factory method in order to change the resulting
# product's type.
class ConcreteCreator1 < Creator
  # Note that the signature of the method still uses the abstract product type,
  # even though the concrete product is actually returned from the method. This
  # way the Creator can stay independent of concrete product classes.
  def factory_method
    ConcreteProduct1.new
  end
end

class ConcreteCreator2 < Creator
  # @return [ConcreteProduct2]
  def factory_method
    ConcreteProduct2.new
  end
end

# The Product interface declares the operations that all concrete products must
# implement.
class Product
  # return [String]
  def operation
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end

# Concrete Products provide various implementations of the Product interface.
class ConcreteProduct1 < Product
  # @return [String]
  def operation
    '{Result of the ConcreteProduct1}'
  end
end

class ConcreteProduct2 < Product
  # @return [String]
  def operation
    '{Result of the ConcreteProduct2}'
  end
end

# The client code works with an instance of a concrete creator, albeit through
# its base interface. As long as the client keeps working with the creator via
# the base interface, you can pass it any creator's subclass.
def client_code(creator)
  print "Client: I'm not aware of the creator's class, but it still works.\n"\
        "#{creator.some_operation}"
end

puts 'App: Launched with the ConcreteCreator1.'
client_code(ConcreteCreator1.new)
puts "\n\n"

puts 'App: Launched with the ConcreteCreator2.'
client_code(ConcreteCreator2.new)

```

#### output.txt: 执行结果


```bash
App: Launched with the ConcreteCreator1.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct1}

App: Launched with the ConcreteCreator2.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct2}

```

### python


#### main.py: 概念示例
```python
from __future__ import annotations
from abc import ABC, abstractmethod


class Creator(ABC):
    """
    The Creator class declares the factory method that is supposed to return an
    object of a Product class. The Creator's subclasses usually provide the
    implementation of this method.
    """

    @abstractmethod
    def factory_method(self):
        """
        Note that the Creator may also provide some default implementation of
        the factory method.
        """
        pass

    def some_operation(self) -> str:
        """
        Also note that, despite its name, the Creator's primary responsibility
        is not creating products. Usually, it contains some core business logic
        that relies on Product objects, returned by the factory method.
        Subclasses can indirectly change that business logic by overriding the
        factory method and returning a different type of product from it.
        """

        # Call the factory method to create a Product object.
        product = self.factory_method()

        # Now, use the product.
        result = f"Creator: The same creator's code has just worked with {product.operation()}"

        return result


"""
Concrete Creators override the factory method in order to change the resulting
product's type.
"""


class ConcreteCreator1(Creator):
    """
    Note that the signature of the method still uses the abstract product type,
    even though the concrete product is actually returned from the method. This
    way the Creator can stay independent of concrete product classes.
    """

    def factory_method(self) -> Product:
        return ConcreteProduct1()


class ConcreteCreator2(Creator):
    def factory_method(self) -> Product:
        return ConcreteProduct2()


class Product(ABC):
    """
    The Product interface declares the operations that all concrete products
    must implement.
    """

    @abstractmethod
    def operation(self) -> str:
        pass


"""
Concrete Products provide various implementations of the Product interface.
"""


class ConcreteProduct1(Product):
    def operation(self) -> str:
        return "{Result of the ConcreteProduct1}"


class ConcreteProduct2(Product):
    def operation(self) -> str:
        return "{Result of the ConcreteProduct2}"


def client_code(creator: Creator) -> None:
    """
    The client code works with an instance of a concrete creator, albeit through
    its base interface. As long as the client keeps working with the creator via
    the base interface, you can pass it any creator's subclass.
    """

    print(f"Client: I'm not aware of the creator's class, but it still works.\n"
          f"{creator.some_operation()}", end="")


if __name__ == "__main__":
    print("App: Launched with the ConcreteCreator1.")
    client_code(ConcreteCreator1())
    print("\n")

    print("App: Launched with the ConcreteCreator2.")
    client_code(ConcreteCreator2())

```


#### Output.txt: 执行结果

```bash


App: Launched with the ConcreteCreator1.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct1}

App: Launched with the ConcreteCreator2.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct2}

```

### golang

- [golang by example 实例](https://golangbyexample.com/golang-factory-design-pattern/) 


#### iGun.go: 产品接口

```go
package main

type iGun interface {
    setName(name string)
    setPower(power int)
    getName() string
    getPower() int
}

```


#### gun.go: 具体产品

```go


package main

type gun struct {
    name  string
    power int
}

func (g *gun) setName(name string) {
    g.name = name
}

func (g *gun) getName() string {
    return g.name
}

func (g *gun) setPower(power int) {
    g.power = power
}

func (g *gun) getPower() int {
    return g.power
}

```


#### ak47.go: 具体产品


```go
package main

type ak47 struct {
    gun
}

func newAk47() iGun {
    return &ak47{
        gun: gun{
            name:  "AK47 gun",
            power: 4,
        },
    }
}

```
####  musket.go: 具体产品


```go
package main

type musket struct {
    gun
}

func newMusket() iGun {
    return &musket{
        gun: gun{
            name:  "Musket gun",
            power: 1,
        },
    }
}

```
#### gunFactory.go: 工厂

```go


package main

import "fmt"

func getGun(gunType string) (iGun, error) {
    if gunType == "ak47" {
        return newAk47(), nil
    }
    if gunType == "musket" {
        return newMusket(), nil
    }
    return nil, fmt.Errorf("Wrong gun type passed")
}

```
#### main.go: 客户端代码

```go

package main

import "fmt"

func main() {
    ak47, _ := getGun("ak47")
    musket, _ := getGun("musket")

    printDetails(ak47)
    printDetails(musket)
}

func printDetails(g iGun) {
    fmt.Printf("Gun: %s", g.getName())
    fmt.Println()
    fmt.Printf("Power: %d", g.getPower())
    fmt.Println()
}

```
#### output.txt: 执行结果

```bash

Gun: AK47 gun
Power: 4
Gun: Musket gun
Power: 1

```


> [!WARNING]
> - ruby 和 python 没有接口的概念，
>  	- 如果实现一个接口，需要直接raise 异常
>  	- 子类实现