//errorHandler هو دالة مساعدة تُستخدم لإنشاء أخطاء مخصصة تحتوي على معلومات إضافية مثل رمز الحالة ورسالة الخطأ.
export const errorHandler=(statusCode,message)=>{ 
    const error=new Error()
    error.statusCode=statusCode
    error.message=message
    return error
}