({
    doInit : function(component, event, helper) {
        //alert('Invoked');
        component.set("v.assetId",component.get("v.recordId"));        
    },
    
    handleButtonClick : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var caseID;
        workspaceAPI.getFocusedTabInfo().then(function(tabInfoResponse) {
            workspaceAPI.getTabInfo({
                tabId: tabInfoResponse.parentTabId
            }).then(function(parentTabInfoResponse) {
                caseID = parentTabInfoResponse.recordId;
                //alert('invoke');
                component.set("v.caseRecordId",caseID);
                //alert(caseID); 
                var policySearchMethod = component.get("c.policySearchCallout");
                policySearchMethod.setParams({ caseId : caseID});
                policySearchMethod.setCallback(this, function(response){
                    var state= response.getState();
                    if(state=='SUCCESS'){
                        var returnVal = JSON.parse(response.getReturnValue());                       
                        var responseList = [];
                        responseList = returnVal['rows'];
                        //alert(JSON.stringify(responseList));
                        component.set("v.responseRows",responseList);
                    }
                });
                $A.enqueueAction(policySearchMethod);               
            })
        }).catch(function(error) {
            alert(error);
        });
        //alert(component.get("v.caseRecordId"));
    },
    
    handleInquiryClick : function(component, event, helper) {
       // alert('called');
        var index = event.currentTarget.dataset.rowIndex;
        var workspaceAPI = component.find("workspace");
        //alert(index);
        var inquirySearchMethod = component.get("c.inquiryCallout");
        inquirySearchMethod.setParams({ inquiryNo : index});
        inquirySearchMethod.setCallback(this, function(response){
            var state= response.getState();
            if(state=='SUCCESS'){
                var returnVal = JSON.parse(response.getReturnValue());                       
                alert(JSON.stringify(returnVal));
                component.set("v.inquiryResponse",JSON.stringify(returnVal));
                
                var evt = $A.get("e.force:navigateToComponent");
                //alert('Event>> '+evt);                
                evt.setParams({
                    componentDef : "c:CCT_GB_InquirySearchResult",
                    componentAttributes: {
                        InquirySearchResult : JSON.parse(component.get("v.inquiryResponse"))                        
                    }
                });
                evt.fire();               
                
              
               /* workspaceAPI.getEnclosingTabId().then(function(enclosedTabId){
                    alert('enclosed tab'+enclosedTabId);
                    workspaceAPI.openSubtab({
                        parentTabId : enclosedTabId,
                        url : '/lightning/r/Asset/' + index + '/view',
                        focus : true
                    }).then(function(subTabId){
                        alert('sub tab id'+subTabId);
                    }).catch(function(error){
                        alert('error');
                    });
                });*/
            }
        });
        $A.enqueueAction(inquirySearchMethod);
        
    }
    
    /*handleGotoRelatedList : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        console.log('Event>> '+evt);
        var InquirySearchResult = component.get("v.inquiryResponse");
        evt.setParams({
            componentDef : "c:CCT_GB_InquirySearchResult",
            componentAttributes: {
                InquirySearchResult : InquirySearchResult,
                recordCount : component.get("v.recordCount"),
                userRole : component.get("v.userRole")
            }
        });
        evt.fire();
	},*/
    
    
})