({
	doInit : function(component, event, helper) {
		alert('here');
        var myPageRef = component.get("v.pageReference");
        var inquiryRes = myPageRef && myPageRef.state ? myPageRef.state.c__InquirySearchResult : "World";
        component.set("v.InquirySearchResult", inquiryRes);
        //alert(component.get("v.InquirySearchResult"));
        var inquiryResult = JSON.parse(component.get("v.InquirySearchResult"));
        alert(inquiryResult);
        alert(JSON.stringify(inquiryResult));
        var generalRes = inquiryResult.general;
        //alert(JSON.stringify(generalRes));
        //alert(JSON.stringify(inquiryResult.internet));
        component.set("v.generalResult",generalRes);
        component.set("v.internetResult",inquiryResult.internet);
        component.set("v.notesResult",inquiryResult.notes);
        component.set("v.emailRepliesResult",inquiryResult.emailedReplies);
        component.set("v.logHistoryResult",inquiryResult.logHistory);
        
	},
    
    handlePageChange : function(component, event, helper){
        alert('in page change');
    }
});
