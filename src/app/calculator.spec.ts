import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Tests for multiply', () => {
    it('should return a nine', () => {
      //AAA
      //Arrange
      const calculator = new Calculator();
      //Act
      const res = calculator.multiply(3, 3);
      //Assert
      expect(res).toEqual(9);
    });

    it('should return four', () => {
      //Arrange
      const calculator = new Calculator();
      //Act
      const res = calculator.multiply(1, 4);
      //Assert
      expect(res).toEqual(4);
    });
  });

  describe('Tests for divide', () => {
    it('should return a some numbers', () => {
      //Arrange
      const calculator = new Calculator();
      //Act & Assert
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });

    it('for a zero', () => {
      //Arrange
      const calculator = new Calculator();
      //Act & Assert
      expect(calculator.divide(6, 0)).toBeNull();
      expect(calculator.divide(5, 0)).toBeNull();
      expect(calculator.divide(5452345243, 0)).toBeNull();
    });

    it('test matchers', () => {
      const name = 'nicolas';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1 + 3 === 4).toBeTruthy();
      expect(1 + 1 === 3).toBeFalsy();

      expect(5).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('123456').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });
  });
});
