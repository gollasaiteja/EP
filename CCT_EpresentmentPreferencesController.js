({
    onPageLoad : function(component, event, helper) {
        var contactId = component.get("v.contactId");        
        var frameworkRes = component.get("v.frameworkResponseClass");
        var params = {"cntctId":contactId};
        var action = component.get("c.onInitMethod");
        action.setParams(params);
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                if(response.getReturnValue()){
                    var res = JSON.parse(response.getReturnValue());
                    console.log('res===='+res);
                    component.set("v.frameworkResponseClass",res);
                    var uniqueProductNames = [...new Set(res.map(x => x.productName))];
                    console.log('res===='+uniqueProductNames);
                    component.set("v.uniqueProdNames",uniqueProductNames);
                    for(var i=0; i<res.length; i++){
                        if(res[i].productName == 'all'){
                            if(res[i].preferenceDelivery == 'electronic'){
                                component.set("v.isElectronic",true);
                            }
                            else if(res[i].preferenceDelivery == 'notselected'){
                                component.set("v.isNotSelected",true);
                            } 
							else if(res[i].preferenceDelivery == 'paper'){
                                 component.set("v.isPaper",true);   
                            }
                        }
                        
                    }
                    
                   // var electronicVal = component.get("v.isElectronic"); 
                    var customizeVal = component.get("v.isNotSelected");
                    //alert(electronicVal+'====='+customizeVal)
                    /*if(electronicVal){
                        component.set("v.isDisabled",true);
                    }*/
                    if(customizeVal){
                        component.set("v.showAccordion",true);
                    }
                    /*if(!electronicVal && !customizeVal){
                        component.set("v.isDisabled",true);
                    }  */                
                    
                }
                else{
                    alert('Either enterprise ID is null or response is null');
                    //stay on same contact page. - logic
                }
                
                
                var redirectEvent = $A.get("e.c:CCT_RedirectToUrl");
                    /*alert('redirectEvent'+redirectEvent);
                alert('contactId==='+contactId);*/
                    redirectEvent.setParams({"redirectRecId":contactId,"SObject":"Contact"});
                redirectEvent.fire();
            }
            else{
                alert('Unexpected error');
            }
        });
        $A.enqueueAction(action);       
        
    },
    onSave: function(component, event, helper) {
        var items = component.find("preferenceTypeId");
        var res = component.get("v.frameworkResponseClass");
        var electronicResults = component.find("preferenceTypeId");
        var paperResults = component.find("paperId");
        if($A.util.isEmpty(paperResults)) { 
            paperResults = [];
        }
        if(!$A.util.isArray(paperResults)) {
            paperResults = [ paperResults ];
        }
        
        if($A.util.isEmpty(electronicResults)) { 
            electronicResults = [];
        }
        if(!$A.util.isArray(electronicResults)) {
            electronicResults = [ electronicResults ];
        }
        
        for(var i=0; i<res.length; i++){
            
        }
        /*if(electronicResults && paperResults){
        	for(var i=0; i<1; i++){
                if(electronicResults[i].get("v.checked") && paperResults[i].get("v.checked")){
                    alert('Please select either Paper or Electronic type delivery');
                    return;
                }
            }
        }*/
        
        var selectionType;
        if(component.get("v.isElectronic")){
            selectionType = 'electronic';
        }
        else{
            selectionType = 'paper';
        }
        if(component.get("v.isNotSelected")){
            selectionType = 'notselected';
        }
        var prefList = [];
        var responseMap = {};
        var electronicMap = {};
        var paperMap = {};
        var initialRes = component.get("v.frameworkResponseClass");
        if(initialRes){
            for(var i=0; i< initialRes.length; i++){
                var keyVal = initialRes[i].preferenceType +'-'+initialRes[i].productName;
                var reqVal = initialRes[i]._id +'-'+initialRes[i].preferenceIsChangeAllowed+'-'+initialRes[i].default;
                responseMap[keyVal] = reqVal;
            }
        //alert(JSON.stringify(responseMap));
        }
        if(items){
            for(var i=0; i<items.length; i++){
                var concatenateVal = items[i].get("v.value")+'-'+items[i].get("v.checked");
                //alert(concatenateVal);
                prefList.push(concatenateVal);   
                electronicMap[items[i].get("v.value")] = items[i].get("v.checked");
            }
        }
        if(paperResults){
            for(var i=0; i<paperResults.length; i++){                  
                paperMap[paperResults[i].get("v.value")] = paperResults[i].get("v.checked");
            }
        }
        //console.log('electronicMap==='+JSON.stringify(electronicMap));
        //console.log('paperMap==='+JSON.stringify(paperMap))
        for(var j=0; j< initialRes.length; j++){
            //alert('here');
            //for(var i in electronicMap){
                //alert('inside');
                //alert('1==='+initialRes[j].preferenceType +'-'+initialRes[j].productName);
                //alert('2==='+paperMap['statements-investments']);
                var keyVal =  initialRes[j].preferenceType +'-'+initialRes[j].productName;
            //alert('key==='+keyVal);
                if(keyVal != 'global-all' && 
                   electronicMap[keyVal] == paperMap[keyVal] && selectionType!='electronic'&& selectionType!='paper'){
                    alert('Please select either Paper or Electronic type delivery2');
                    return;
                }
            //}
        }
        
        var action = component.get("c.sendUpdateRequest");
        
        //alert(JSON.stringify(component.get("v.frameworkResponseClass")));
        var params = {"cntactId":component.get("v.contactId"),
                      "preferenceTypeList":prefList,
                      "type":selectionType,
                      "initialResponse":responseMap};
        action.setParams(params);
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                if(response.getReturnValue()){
                    alert('success');
                    var res = JSON.parse(response.getReturnValue());
                    console.log('res===='+res);
                    component.set("v.frameworkResponseClass",res);
                    var uniqueProductNames = [...new Set(res.map(x => x.productName))];
                    console.log('res===='+uniqueProductNames);
                    component.set("v.uniqueProdNames",uniqueProductNames);
                    for(var i=0; i<res.length; i++){
                        if(res[i].productName == 'all'){
                            if(res[i].preferenceDelivery == 'electronic'){
                                component.set("v.isElectronic",true);
                            }
                            else if(res[i].preferenceDelivery == 'notselected'){
                                component.set("v.isNotSelected",true);
                            } 
							else if(res[i].preferenceDelivery == 'paper'){
                                 component.set("v.isPaper",true);   
                            }
                        }
                        
                    }
                    var customizeVal = component.get("v.isNotSelected");
                    if(customizeVal){
                        component.set("v.showAccordion",true);
                    }
                    
                }
                
            }
            else{
                alert('Unexpected error');
            }
        });
        $A.enqueueAction(action);
    },
    
    enableAccordion : function(component,helper,event){
        if(component.get("v.isNotSelected")){
            component.set("v.showAccordion",true);
            component.set("v.isPaper",false);
            component.set("v.isElectronic",false);
        }
        else{
           component.set("v.showAccordion",false);
        }       
    },
    
    handleElectronicClick : function(component,helper,event){
        if(component.get("v.isElectronic")){
            component.set("v.isPaper",false);
            component.set("v.isNotSelected",false);
            component.set("v.showAccordion",false);
        }
    },
    
    handlePaperClick : function(component,helper,event){
        if(component.get("v.isPaper")){
            component.set("v.isElectronic",false);
            component.set("v.isNotSelected",false);
            component.set("v.showAccordion",false);
        }
    },
    
    handleElectronicDelivery : function(component,helper,event){
        
        /*if(component.find("preferenceTypeId").get("v.checked")){
            component.set("v.disablePaperDlvy",false);
        }
        else{
            component.set("v.disablePaperDlvy",true);
        } */       
    },
    
    handlePaperDelivery : function(component,helper,event){
        /*if(component.find("paperId").get("v.checked")){
            component.set("v.disableElectronicDlvy",false);
        }
        else{
            component.set("v.disableElectronicDlvy",true);
        }*/
    },
    
    handlePreferenceTypeDelivery : function(component,helper,event){
        var res = component.get("v.frameworkResponseClass");
        var electronicResults = component.find("preferenceTypeId");
        var paperResults = component.find("paperId");
        if($A.util.isEmpty(paperResults)) { 
            paperResults = [];
        }
        if(!$A.util.isArray(paperResults)) {
            paperResults = [ paperResults ];
        }
        
        if($A.util.isEmpty(electronicResults)) { 
            electronicResults = [];
        }
        if(!$A.util.isArray(electronicResults)) {
            electronicResults = [ electronicResults ];
        }
        for(var i=0; i<res.length; i++){
            if(electronicResults && paperResults){
                if(electronicResults[i].get("v.checked") && paperResults[i].get("v.checked")){
                    alert('Please select either Paper or Electronic type delivery1');
                }
            }
        }
    },
    
})
