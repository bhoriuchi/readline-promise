import readline from '../dist'

console.log('impl', readline)

async function main () {
  const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  const albumId = await rlp.questionAsync('albumId? ')

  console.log({
    albumId
  })

  //process.stdin.end() // works
  rlp.close() // would match the readline api
}

main()