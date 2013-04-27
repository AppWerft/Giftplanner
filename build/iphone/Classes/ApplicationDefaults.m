/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"Jq0Y6fVoV5JnOMqEHQGp0c2FDhaxpqdy"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"b6oAMwOMNl66s1S9UgqJ7v9SsYiTS9zL"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"pv22uiJoKdJV1WyehTYoqF3xg8RJNKXl"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"IPNvvbI5WVIXKlLEyN4T8zSDpHBLZNHz"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"eCUjpvAbsKLcwfEhx2UNoXQnm2ag1l50"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"oRjdqgn5DsXspYavfBtD1Qm0zP8z999u"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
