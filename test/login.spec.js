import { expect } from 'chai';
import { remote } from 'webdriverio';

// Define capabilities directly in the file
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.technisys.hsbc.mobile',
  'appium:appActivity': 'com.technisys.hsbc.mobile.MainActivity',
  'appium:autoGrantPermissions': true,
  'appium:enforceXPath1': true,
};

// Define WebDriverIO options
const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

// Hardcoded user data
const userData = {
  username: 'hola',
  token: '111111',
  password: 'password',
};

describe('Mobile App Login', function () {
  this.timeout(30000); // Aumenta el timeout para todas las pruebas en este bloque
  let driver;

  // Initialize the driver before running the tests
  before(async function () {
    this.timeout(20000); // Increase timeout to 30 seconds
    driver = await remote(wdOpts);
  });

  // Cleanup after the tests are finished
  after(async function () {
    if (driver) {
      //await driver.deleteSession();
    }
  });

  it('should log in with the correct credentials', async function () {
    // Navigate to login screen
    const accedaAiBancaButton = await driver.$(
      '//android.view.View[@content-desc="Acceda a iBanca"]/android.view.View/android.view.View'
    );
    await accedaAiBancaButton.click();

    // Input username
    const userInput = await driver.$(
      '//android.view.View[@resource-id="ExternalDash__u9jmq4q"]/android.view.View[2]/android.view.View[2]/android.view.View[1]/android.view.View/android.widget.EditText'
    );
    await userInput.setValue(userData.username);
    expect(await userInput.getText()).to.equal(userData.username); // Verifica que el valor se haya ingresado correctamente

    // Input token
    const tokenInput = await driver.$(
      '//android.widget.EditText[@resource-id="otp"]'
    );
    await driver.waitUntil(async () => await tokenInput.isDisplayed(), {
      timeout: 10000, // Ajusta el timeout según sea necesario
      timeoutMsg: 'Token input field not visible after 10 seconds',
    });
    expect(await tokenInput.isDisplayed()).to.be.true; // Verifica que el campo de token esté visible

    // Focus and complete token
    await tokenInput.click();
    await tokenInput.setValue(userData.token);
    expect(await tokenInput.getText()).to.equal(userData.token); // Verifica que el valor del token se haya ingresado correctamente

    // Click on continuar
    const buttonContinuar = await driver.$(
      '//android.widget.Button[@text="CONTINUAR"]'
    );

    await driver.waitUntil(async () => await buttonContinuar.isDisplayed(), {
      timeout: 10000, // Ajusta el timeout según sea necesario
      timeoutMsg: 'Token input field not visible after 10 seconds',
    });
    expect(await buttonContinuar.isDisplayed()).to.be.true;

    await buttonContinuar.click();

    // Wait until the password field is visible
    const inputContrasena = await driver.$('//android.widget.EditText');
    await driver.waitUntil(async () => await inputContrasena.isDisplayed(), {
      timeout: 10000, // Ajusta el timeout según sea necesario
      timeoutMsg: 'Password input field not visible after 10 seconds',
    });
    expect(await inputContrasena.isDisplayed()).to.be.true; // Verifica que el campo de contraseña esté visible

    // Focus and input password
    await inputContrasena.click();
    await inputContrasena.clearValue();
    await inputContrasena.setValue(userData.password);
    expect(await inputContrasena.getText()).to.equal(userData.password); // Verifica que el valor de la contraseña se haya ingresado correctamente

    // Click on ingresar
    const buttonIngresar = await driver.$(
      '//android.widget.Button[@text="INGRESAR"]'
    );

    await driver.waitUntil(async () => await buttonIngresar.isDisplayed(), {
      timeout: 10000, // Ajusta el timeout según sea necesario
      timeoutMsg: 'Token input field not visible after 10 seconds',
    });
    expect(await buttonIngresar.isDisplayed()).to.be.true;

    await buttonIngresar.click();
  });
});
