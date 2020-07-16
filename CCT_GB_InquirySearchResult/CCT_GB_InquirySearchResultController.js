({
	doInit : function(component, event, helper) {
		//alert('here');
        //alert(component.get("v.InquirySearchResult"));
        var inquiryResult = component.get("v.InquirySearchResult");
        //alert(JSON.stringify(inquiryResult));
        var generalRes = inquiryResult.general;
        //alert(JSON.stringify(generalRes));
        alert(JSON.stringify(inquiryResult.internet));
        component.set("v.generalResult",generalRes);
        component.set("v.internetResult",inquiryResult.internet);
        component.set("v.notesResult",inquiryResult.notes);
        component.set("v.emailRepliesResult",inquiryResult.emailedReplies);
        component.set("v.logHistoryResult",inquiryResult.logHistory);
        
	}
})