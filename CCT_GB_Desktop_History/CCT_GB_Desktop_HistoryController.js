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
        //alert('called');
        var index = event.currentTarget.dataset.rowIndex;
        var workspaceAPI = component.find("workspace");
        //alert(index);
        var inquirySearchMethod = component.get("c.inquiryCallout");
        inquirySearchMethod.setParams({ inquiryNo : index});
        inquirySearchMethod.setCallback(this, function(response){
            var state= response.getState();
            if(state=='SUCCESS'){
                var returnVal = JSON.parse(response.getReturnValue());                       
                //alert(JSON.stringify(returnVal));
                component.set("v.inquiryResponse",JSON.stringify(returnVal));
                
                
                
                var navService = component.find("navService");
                alert('4'+component.get("v.inquiryResponse"));
                
                // set the pageReference object used to navigate to the component. Include any parameters in the state key.
                var pageReference = {
                    type: "standard__component",
                    attributes: {
                        componentName: "c__CCT_GB_InquirySearchResult"
                    },
                    state: {
                        "c__InquirySearchResult": component.get("v.inquiryResponse")
                    }
                };
                
                // handles checking for console and standard navigation and then navigating to the component appropriately
                workspaceAPI
                .isConsoleNavigation()
                .then(function(isConsole) {
                    if (isConsole) {
                        //  // in a console app - generate a URL and then open a subtab of the currently focused parent tab
                        navService.generateUrl(pageReference).then(function(cmpURL) {
                            alert(cmpURL);
                            workspaceAPI
                            .getEnclosingTabId()
                            .then(function(tabId) {
                                return workspaceAPI.openSubtab({
                                    parentTabId: tabId,
                                    url: cmpURL,
                                    focus: true
                                });
                            })
                            .then(function(subTabId) {
                                // the subtab has been created, use the Id to set the label
                                workspaceAPI.setTabLabel({
                                    tabId: subTabId,
                                    label: "SubTab Label"
                                });
                                workspaceAPI.setTabIcon({
                                    tabId: subtabId, 
                                    icon: "standard:knowledge",
                                    iconAlt: "SubTab Label Name"
                                });
                                
                            });
                        });
                    } else {
                        // this is standard navigation, use the navigate method to open the component
                        navService.navigate(pageReference, false);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
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
