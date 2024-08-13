import { expect } from 'chai';
import { remote } from 'webdriverio';

// Define capabilities directly in the file
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.technisys.hsbc.mobile',
  'appium:appActivity': 'com.technisys.hsbc.mobile.MainActivity',
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
  let driver;

  // Initialize the driver before running the tests
  before(async function () {
    this.timeout(20000); // Increase timeout to 30 seconds
    driver = await remote(wdOpts);
  });

  // Cleanup after the tests are finished
  after(async function () {
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should log in with the correct credentials', async function () {
    // Handle permission dialogs
    const permissionButton1 = await driver.$('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button")');
    await permissionButton1.click();

    const permissionButton2 = await driver.$('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
    if (await permissionButton2.isDisplayed()) {
      await permissionButton2.click();
    }

    const permissionButton3 = await driver.$('android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")');
    if (await permissionButton3.isDisplayed()) {
      await permissionButton3.click();
    }

    // Navigate to login screen
    const accedaAiBancaButton = await driver.$('//android.view.View[@content-desc="Acceda a iBanca"]/android.view.View/android.view.View');
    await accedaAiBancaButton.click();

    // Input username
    const userInput = await driver.$('//android.view.View[@resource-id="ExternalDash__u9jmq4q"]/android.view.View[2]/android.view.View[2]/android.view.View[1]/android.view.View/android.widget.EditText');
    await userInput.setValue(userData.username);

    // Input token
    const tokenInput = await driver.$('//android.widget.EditText[@resource-id="otp"]');
    await tokenInput.click();
    await tokenInput.setValue(userData.token);

    // Click on continuar
    const buttonContinuar = await driver.$('//android.widget.Button[@text="CONTINUAR"]');
    await buttonContinuar.click();

    // Wait until the password field is visible
    const inputContrasena = await driver.$('//android.widget.EditText');
    await driver.waitUntil(
      async () => (await inputContrasena.isDisplayed()),
      {
        timeout: 10000, // Adjust timeout as needed
        timeoutMsg: 'Password input field not visible after 10 seconds',
      }
    );

    // Focus and input password
    await inputContrasena.click();
    await inputContrasena.clearValue();
    await inputContrasena.setValue(userData.password);

    // Click on ingresar
    const buttonIngresar = await driver.$('//android.widget.Button[@text="INGRESAR"]');
    await buttonIngresar.click();
  });
});
