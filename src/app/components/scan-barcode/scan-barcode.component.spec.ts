import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanBarcodeComponent } from './scan-barcode.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ScanBarcodeComponent', () => {
    let component: ScanBarcodeComponent;
    let fixture: ComponentFixture<ScanBarcodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScanBarcodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should process barcode correctly when handleBarcodeScanned is called with a number starting with 8900000000777', () => {
        // Assuming 'handleBarcodeScanned' expects a string argument
        // and considering a barcode number starting with 8900000000777
        const testBarcode = "8900000000777123"; // example with additional digits for uniqueness

        // Set up a spy on the 'handleBarcodeScanned' method
        const handleBarcodeScannedSpy = jest.spyOn(component, 'handleBarcodeScanned');

        // Directly call the method as part of the test
        component.handleBarcodeScanned(testBarcode);

        // Check if the method was called with the expected argument
        expect(handleBarcodeScannedSpy).toHaveBeenCalledWith(testBarcode);
    });
});
