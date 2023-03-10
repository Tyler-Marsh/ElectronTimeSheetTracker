


async function runPipeLine() {

let chainedSuccess = true;

async function call1() {

const result = await  new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve('foo')
        }, 1000)
    });
    console.log(result)
    chainedSuccess = false;
}

async function call2() {
    if (!chainedSuccess) {
        return;
    }
    const result2 =  await new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve('bar')
        }, 2000)
    });


    console.log(result2)
}

const result = await call1();
const result2 = await call2();

}


runPipeLine();
// if I consume everything within the promise function it's fine