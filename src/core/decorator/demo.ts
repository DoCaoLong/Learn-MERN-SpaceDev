// // Decorator cho phương thức
// function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;

//   descriptor.value = function (...args: any[]) {
//     console.log(
//       `Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`
//     );
//     const result = originalMethod.apply(this, args);
//     console.log(`Result: ${result}`);
//     return result;
//   };

//   return descriptor;
// }

// class Calculator {
//   @log
//   add(a: number, b: number): number {
//     return a + b;
//   }

//   @log
//   div(a: number, b: number): number {
//     return a / b;
//   }
// }

// const calc = new Calculator();
// calc.add(5, 7); // Output will show logs before and after method execution
// calc.div(4, 2);
