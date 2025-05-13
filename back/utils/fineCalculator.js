export const calculateFine=(dueDate)=>{
    const fineperday=1;
    const today=new Date();
    if(today>dueDate){
        const lateDays =Math.ceil((today-dueDate)/ (1000 * 60 * 60 * 24));
        const fine =lateDays *fineperday;
        return fine;
    }
    return 0;
}