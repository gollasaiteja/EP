public class CCT_GB_DesktopHistoryController {
	private static final String BEARER = 'Bearer ';
    //private static final String AUTH = 'Authorization';

    public static Secret_Setting__c getSecretSettingsData(){
        Secret_Setting__c secretSettingData = new Secret_Setting__c();
        secretSettingData = [select Id,Name,Encrypted_Value__c,Token_Validity_Limit__c,Alternate_Token_Value__c,LastModifiedDate
                             from Secret_Setting__c where Project__c='CCT' AND Name = 'GBDesktop Access Token' Limit 1];
        return secretSettingData;
    }
    
    @AuraEnabled
    public static string policySearchCallout(Id caseId){
        RequestWrapper request = new RequestWrapper();
        Case caseData = [Select Plan_Number__c, Certificate_Name__c, Contact_Type__c  from Case where Id =: caseId];
        Secret_Setting__c secretSettingData = new Secret_Setting__c();
        secretSettingData = getSecretSettingsData();
        
        request.action = 'policySearch';
        request.planNumber = caseData.Plan_Number__c.replaceFirst('^0+','');
        String test123 = '0000012300545400';
        system.debug('test========'+test123.replaceFirst('^0+',''));
        system.debug('plan number======'+request.planNumber);
       // request.memberId = caseData.Certificate_Name__c;
        request.planNumber = '5678910';
        request.memberId = '10';
        request.customerType = '02';
        
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        //req.setEndPoint('https://internal.mesh.dev.api.manulife.com/v1/gb/history/ca/inquiry');
        req.setEndPoint('https://sf.cac.internal.mesh.dev.api.manulife.com/v1/gb/history/ca/inquiry');
        req.setMethod('POST');
        req.setBody(JSON.serialize(request));
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/xml');
        req.setHeader(Label.AUTHORIZATION, BEARER + secretSettingData.Alternate_Token_Value__c);
        if(!Test.isRunningTest()){
            req.setClientCertificateName('nonprod_sf_apigee_client_manulife_com');                    
        } 
        system.debug('request======='+req);
        system.debug('request data======='+JSON.serialize(request));
        HttpResponse res = h.send(req);
        system.debug('direct response==='+res);
        string resBody = res.getBody();
        system.debug('response'+res.getBody());        
        return resBody;
    }
    
    @AuraEnabled
    public static String inquiryCallout(String inquiryNo){
        Secret_Setting__c secretSettingData = new Secret_Setting__c();
        secretSettingData = getSecretSettingsData();
        
        InquiryRequestWrapper inquiryWrapper = new InquiryRequestWrapper();
        inquiryWrapper.action = 'inquirySearch';     
        inquiryWrapper.inquiryNumber = inquiryNo;
        
        Http h = new Http();
        HttpRequest req = new HttpRequest();
      //  req.setEndPoint('https://sf.cac.gb-cc-history-service-dev.apps.cac.preview.pcf.manulife.com/api/inquiry');
        req.setEndPoint('https://sf.cac.internal.mesh.dev.api.manulife.com/v1/gb/history/ca/inquiry');
        req.setMethod('POST');
        req.setBody(JSON.serialize(inquiryWrapper));
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/xml');
        req.setHeader(Label.AUTHORIZATION, BEARER + secretSettingData.Alternate_Token_Value__c);
        if(!Test.isRunningTest()){
            req.setClientCertificateName('nonprod_sf_apigee_client_manulife_com');                    
        } 
        system.debug('request======='+req);
        system.debug('request data======='+JSON.serialize(inquiryWrapper));
        HttpResponse res = h.send(req);
        system.debug('direct response==='+res);
        string resBody = res.getBody();
        system.debug('response'+res.getBody());        
        return resBody;
    }
    
    public class RequestWrapper{
        @AuraEnabled
        public String action {get; set;}
        @AuraEnabled
        public String planNumber {get; set;}
        @AuraEnabled
        public String memberId {get; set;}
        @AuraEnabled
        public String customerType {get; set;}
    }
    
    public class InquiryRequestWrapper{
        @AuraEnabled
        public String action {get; set;}
        @AuraEnabled
        public String inquiryNumber {get; set;}
    }
    
}