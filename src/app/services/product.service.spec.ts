import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import {
  generateManyProducts,
  generateOneProduct,
} from '../models/product.mock';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';

import { ProductsService } from './product.service';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    productsService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(productsService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productsService.getAllSimple().subscribe((data) => {
        console.log(data);
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productsService.getAll().subscribe((data) => {
        console.log(data);
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 + .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 + .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 + .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = 0
        },
      ];
      //Act
      productsService.getAll().subscribe((data) => {
        console.log(data);
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });

  it('should send query params with limit 10 and offset 3', (doneFn) => {
    //Arrange
    const mockData: Product[] = generateManyProducts(3);
    const limit = 10;
    const offset = 3;
    //Act
    productsService.getAll(limit, offset).subscribe((data) => {
      console.log(data);
      //Assert
      expect(data.length).toEqual(mockData.length);
      doneFn();
    });

    //http config
    const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
    const req = httpController.expectOne(url);
    req.flush(mockData);
    const params = req.request.params;
    expect(params.get('limit')).toEqual(`${limit}`);
    expect(params.get('offset')).toEqual(`${offset}`);
  });

  describe('tests for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'New Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12,
      };
      // Act
      productsService.create({ ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('tests for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'Product updated',
      };
      // Act
      productsService.update('1', { ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/1`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('tests for delete', () => {
    it('should delete a product', (doneFn) => {
      // Act
      productsService.delete('1').subscribe((data) => {
        // Assert
        expect(data).toBeTruthy();
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/1`;
      const req = httpController.expectOne(url);
      req.flush(true);
      expect(req.request.urlWithParams).toEqual(url);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('tests for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '1';
      // Act
      productsService.getOne(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right message when the code is 404', (doneFn) => {
      // Arrange
      const messageError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: messageError,
      };
      const productId = '1';
      // Act
      productsService.getOne(productId).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(messageError, mockError);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right message when the code is 409', (doneFn) => {
      // Arrange
      const messageError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: messageError,
      };
      const productId = '1';
      // Act
      productsService.getOne(productId).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(messageError, mockError);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right message when the code is 401', (doneFn) => {
      // Arrange
      const messageError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: messageError,
      };
      const productId = '1';
      // Act
      productsService.getOne(productId).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(messageError, mockError);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right message when the code is 400', (doneFn) => {
      // Arrange
      const messageError = '400 message';
      const mockError = {
        status: HttpStatusCode.BadRequest,
        statusText: messageError,
      };
      const productId = '1';
      // Act
      productsService.getOne(productId).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        },
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(messageError, mockError);
      expect(req.request.method).toEqual('GET');
    });
  });
});
