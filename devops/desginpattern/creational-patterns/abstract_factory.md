## 目的
- 抽象工厂模式是一种创建型设计模式， 它能创建一系列相关的对象， 而无需指定其具体类。


## 抽象工厂模式适合应用场景

### 如果代码需要与多个不同系列的相关产品交互， 但是由于无法提前获取相关信息， 或者出于对未来扩展性的考虑， 你不希望代码基于产品的具体类进行构建， 在这种情况下， 你可以使用抽象工厂。

## 实现方式

- 以不同的产品类型与产品变体为维度绘制矩阵。

- 为所有产品声明抽象产品接口。 然后让所有具体产品类实现这些接口。

- 声明抽象工厂接口， 并且在接口中为所有抽象产品提供一组构建方法。

- 为每种产品变体实现一个具体工厂类。

- 在应用程序中开发初始化代码。 该代码根据应用程序配置或当前环境， 对特定具体工厂类进行初始化。 然后将该工厂对象传递给所有需要创建产品的类。

- 找出代码中所有对产品构造函数的直接调用， 将其替换为对工厂对象中相应构建方法的调用。


## 优缺点

### 优点

- 你可以确保同一工厂生成的产品相互匹配。
- 你可以避免客户端和具体产品代码的耦合。
- 单一职责原则。 你可以将产品生成代码抽取到同一位置， 使得代码易于维护。
- 开闭原则。 向应用程序中引入新产品变体时， 你无需修改客户端代码。

### 缺点

- 由于采用该模式需要向应用中引入众多接口和类， 代码可能会比之前更加复杂。


## demo

### ruby

#### main.rb: 概念示例

```ruby

# The Abstract Factory interface declares a set of methods that return different
# abstract products. These products are called a family and are related by a
# high-level theme or concept. Products of one family are usually able to
# collaborate among themselves. A family of products may have several variants,
# but the products of one variant are incompatible with products of another.
class AbstractFactory
  # @abstract
  def create_product_a
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  # @abstract
  def create_product_b
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end

# Concrete Factories produce a family of products that belong to a single
# variant. The factory guarantees that resulting products are compatible. Note
# that signatures of the Concrete Factory's methods return an abstract product,
# while inside the method a concrete product is instantiated.
class ConcreteFactory1 < AbstractFactory
  def create_product_a
    ConcreteProductA1.new
  end

  def create_product_b
    ConcreteProductB1.new
  end
end

# Each Concrete Factory has a corresponding product variant.
class ConcreteFactory2 < AbstractFactory
  def create_product_a
    ConcreteProductA2.new
  end

  def create_product_b
    ConcreteProductB2.new
  end
end

# Each distinct product of a product family should have a base interface. All
# variants of the product must implement this interface.
class AbstractProductA
  # @abstract
  #
  # @return [String]
  def useful_function_a
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end

# Concrete Products are created by corresponding Concrete Factories.
class ConcreteProductA1 < AbstractProductA
  def useful_function_a
    'The result of the product A1.'
  end
end

class ConcreteProductA2 < AbstractProductA
  def useful_function_a
    'The result of the product A2.'
  end
end

# Here's the the base interface of another product. All products can interact
# with each other, but proper interaction is possible only between products of
# the same concrete variant.
class AbstractProductB
  # Product B is able to do its own thing...
  def useful_function_b
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  # ...but it also can collaborate with the ProductA.
  #
  # The Abstract Factory makes sure that all products it creates are of the same
  # variant and thus, compatible.
  def another_useful_function_b(_collaborator)
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end

# Concrete Products are created by corresponding Concrete Factories.
class ConcreteProductB1 < AbstractProductB
  # @return [String]
  def useful_function_b
    'The result of the product B1.'
  end

  # The variant, Product B1, is only able to work correctly with the variant,
  # Product A1. Nevertheless, it accepts any instance of AbstractProductA as an
  # argument.
  def another_useful_function_b(collaborator)
    result = collaborator.useful_function_a
    "The result of the B1 collaborating with the (#{result})"
  end
end

class ConcreteProductB2 < AbstractProductB
  # @return [String]
  def useful_function_b
    'The result of the product B2.'
  end

  # The variant, Product B2, is only able to work correctly with the variant,
  # Product A2. Nevertheless, it accepts any instance of AbstractProductA as an
  # argument.
  def another_useful_function_b(collaborator)
    result = collaborator.useful_function_a
    "The result of the B2 collaborating with the (#{result})"
  end
end

# The client code works with factories and products only through abstract types:
# AbstractFactory and AbstractProduct. This lets you pass any factory or product
# subclass to the client code without breaking it.
def client_code(factory)
  product_a = factory.create_product_a
  product_b = factory.create_product_b

  puts product_b.useful_function_b.to_s
  puts product_b.another_useful_function_b(product_a).to_s
end

# The client code can work with any concrete factory class.
puts 'Client: Testing client code with the first factory type:'
client_code(ConcreteFactory1.new)

puts "\n"

puts 'Client: Testing the same client code with the second factory type:'
client_code(ConcreteFactory2.new)

```
#### output.txt: 执行结果

```bash


Client: Testing client code with the first factory type:
The result of the product B1.
The result of the B1 collaborating with the (The result of the product A1.)

Client: Testing the same client code with the second factory type:
The result of the product B2.
The result of the B2 collaborating with the (The result of the product A2.)

```

### python


#### main.py: 概念示例

```python


from __future__ import annotations
from abc import ABC, abstractmethod


class AbstractFactory(ABC):
    """
    The Abstract Factory interface declares a set of methods that return
    different abstract products. These products are called a family and are
    related by a high-level theme or concept. Products of one family are usually
    able to collaborate among themselves. A family of products may have several
    variants, but the products of one variant are incompatible with products of
    another.
    """
    @abstractmethod
    def create_product_a(self) -> AbstractProductA:
        pass

    @abstractmethod
    def create_product_b(self) -> AbstractProductB:
        pass


class ConcreteFactory1(AbstractFactory):
    """
    Concrete Factories produce a family of products that belong to a single
    variant. The factory guarantees that resulting products are compatible. Note
    that signatures of the Concrete Factory's methods return an abstract
    product, while inside the method a concrete product is instantiated.
    """

    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA1()

    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB1()


class ConcreteFactory2(AbstractFactory):
    """
    Each Concrete Factory has a corresponding product variant.
    """

    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA2()

    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB2()


class AbstractProductA(ABC):
    """
    Each distinct product of a product family should have a base interface. All
    variants of the product must implement this interface.
    """

    @abstractmethod
    def useful_function_a(self) -> str:
        pass


"""
Concrete Products are created by corresponding Concrete Factories.
"""


class ConcreteProductA1(AbstractProductA):
    def useful_function_a(self) -> str:
        return "The result of the product A1."


class ConcreteProductA2(AbstractProductA):
    def useful_function_a(self) -> str:
        return "The result of the product A2."


class AbstractProductB(ABC):
    """
    Here's the the base interface of another product. All products can interact
    with each other, but proper interaction is possible only between products of
    the same concrete variant.
    """
    @abstractmethod
    def useful_function_b(self) -> None:
        """
        Product B is able to do its own thing...
        """
        pass

    @abstractmethod
    def another_useful_function_b(self, collaborator: AbstractProductA) -> None:
        """
        ...but it also can collaborate with the ProductA.

        The Abstract Factory makes sure that all products it creates are of the
        same variant and thus, compatible.
        """
        pass


"""
Concrete Products are created by corresponding Concrete Factories.
"""


class ConcreteProductB1(AbstractProductB):
    def useful_function_b(self) -> str:
        return "The result of the product B1."

    """
    The variant, Product B1, is only able to work correctly with the variant,
    Product A1. Nevertheless, it accepts any instance of AbstractProductA as an
    argument.
    """

    def another_useful_function_b(self, collaborator: AbstractProductA) -> str:
        result = collaborator.useful_function_a()
        return f"The result of the B1 collaborating with the ({result})"


class ConcreteProductB2(AbstractProductB):
    def useful_function_b(self) -> str:
        return "The result of the product B2."

    def another_useful_function_b(self, collaborator: AbstractProductA):
        """
        The variant, Product B2, is only able to work correctly with the
        variant, Product A2. Nevertheless, it accepts any instance of
        AbstractProductA as an argument.
        """
        result = collaborator.useful_function_a()
        return f"The result of the B2 collaborating with the ({result})"


def client_code(factory: AbstractFactory) -> None:
    """
    The client code works with factories and products only through abstract
    types: AbstractFactory and AbstractProduct. This lets you pass any factory
    or product subclass to the client code without breaking it.
    """
    product_a = factory.create_product_a()
    product_b = factory.create_product_b()

    print(f"{product_b.useful_function_b()}")
    print(f"{product_b.another_useful_function_b(product_a)}", end="")


if __name__ == "__main__":
    """
    The client code can work with any concrete factory class.
    """
    print("Client: Testing client code with the first factory type:")
    client_code(ConcreteFactory1())

    print("\n")

    print("Client: Testing the same client code with the second factory type:")
    client_code(ConcreteFactory2())

```    

####  Output.txt: 执行结果

```bash


Client: Testing client code with the first factory type:
The result of the product B1.
The result of the B1 collaborating with the (The result of the product A1.)

Client: Testing the same client code with the second factory type:
The result of the product B2.
The result of the B2 collaborating with the (The result of the product A2.)

```

### golang




#### iSportsFactory.go: 抽象工厂接口

```golang


package main

import "fmt"

type iSportsFactory interface {
    makeShoe() iShoe
    makeShirt() iShirt
}

func getSportsFactory(brand string) (iSportsFactory, error) {
    if brand == "adidas" {
        return &adidas{}, nil
    }

    if brand == "nike" {
        return &nike{}, nil
    }

    return nil, fmt.Errorf("Wrong brand type passed")
}

```


#### adidas.go: 具体工厂
```golang


package main

type adidas struct {
}

func (a *adidas) makeShoe() iShoe {
    return &adidasShoe{
        shoe: shoe{
            logo: "adidas",
            size: 14,
        },
    }
}

func (a *adidas) makeShirt() iShirt {
    return &adidasShirt{
        shirt: shirt{
            logo: "adidas",
            size: 14,
        },
    }
}
```


#### nike.go: 具体工厂

```golang

package main

type nike struct {
}

func (n *nike) makeShoe() iShoe {
    return &nikeShoe{
        shoe: shoe{
            logo: "nike",
            size: 14,
        },
    }
}

func (n *nike) makeShirt() iShirt {
    return &nikeShirt{
        shirt: shirt{
            logo: "nike",
            size: 14,
        },
    }
}

```


#### iShoe.go: 抽象产品

```golang


package main

type iShoe interface {
    setLogo(logo string)
    setSize(size int)
    getLogo() string
    getSize() int
}

type shoe struct {
    logo string
    size int
}

func (s *shoe) setLogo(logo string) {
    s.logo = logo
}

func (s *shoe) getLogo() string {
    return s.logo
}

func (s *shoe) setSize(size int) {
    s.size = size
}

func (s *shoe) getSize() int {
    return s.size
}

```



#### adidasShoe.go: 具体产品

```golang

package main

type adidasShoe struct {
    shoe
}
 nikeShoe.go: 具体产品
package main

type nikeShoe struct {
    shoe
}
```


#### iShirt.go: 抽象产品

```golang

package main

type iShirt interface {
    setLogo(logo string)
    setSize(size int)
    getLogo() string
    getSize() int
}

type shirt struct {
    logo string
    size int
}

func (s *shirt) setLogo(logo string) {
    s.logo = logo
}

func (s *shirt) getLogo() string {
    return s.logo
}

func (s *shirt) setSize(size int) {
    s.size = size
}

func (s *shirt) getSize() int {
    return s.size
}

```

#### adidasShirt.go: 具体产品
```golang


package main

type adidasShirt struct {
    shirt
}
 nikeShirt.go: 具体产品
package main

type nikeShirt struct {
    shirt
}
```


#### main.go: 客户端代码

```golang


package main

import "fmt"

func main() {
    adidasFactory, _ := getSportsFactory("adidas")
    nikeFactory, _ := getSportsFactory("nike")

    nikeShoe := nikeFactory.makeShoe()
    nikeShirt := nikeFactory.makeShirt()

    adidasShoe := adidasFactory.makeShoe()
    adidasShirt := adidasFactory.makeShirt()

    printShoeDetails(nikeShoe)
    printShirtDetails(nikeShirt)

    printShoeDetails(adidasShoe)
    printShirtDetails(adidasShirt)
}

func printShoeDetails(s iShoe) {
    fmt.Printf("Logo: %s", s.getLogo())
    fmt.Println()
    fmt.Printf("Size: %d", s.getSize())
    fmt.Println()
}

func printShirtDetails(s iShirt) {
    fmt.Printf("Logo: %s", s.getLogo())
    fmt.Println()
    fmt.Printf("Size: %d", s.getSize())
    fmt.Println()
}


```
#### output.txt: 执行结果
```bash


Logo: nike
Size: 14
Logo: nike
Size: 14
Logo: adidas
Size: 14
Logo: adidas
Size: 14

```