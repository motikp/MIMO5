/*POST /me/authentication/phoneMethods
POST /users/{id | userPrincipalName}/authentication/phoneMethods
const options = {
	authProvider,
};

const client = Client.init(options);

const phoneAuthenticationMethod = {
  phoneNumber: "phoneNumber",
  phoneType: "phonetype"
};

let res = await client.api('/me/authentication/phoneMethods')
	.version('beta')
	.post(phoneAuthenticationMethod);
    // Use WinHttpOpen to obtain an HINTERNET handle.
    HINTERNET hSession = WinHttpOpen(L"A WinHTTP Example Program/1.0", 
                                    WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                                    WINHTTP_NO_PROXY_NAME, 
                                    WINHTTP_NO_PROXY_BYPASS, 0);
    if (hSession)
    {
        // Use WinHttpSetTimeouts to set a new time-out values.
        if (!WinHttpSetTimeouts( hSession, 10000, 10000, 10000, 10000))
            printf( "Error %u in WinHttpSetTimeouts.\n", GetLastError());
              
        // PLACE ADDITIONAL CODE HERE.
    
        // When finished, release the HINTERNET handle.
        WinHttpCloseHandle(hSession);
    }
    else
    {
        printf("Error %u in WinHttpOpen.\n", GetLastError());
    }*/