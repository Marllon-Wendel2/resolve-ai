# 1 - Usar qual linguagem e framework no backend?

Eu tinha 3 opções que tenho um bom nível de experiência:

- nodeJS com NestJS
- Java com Spring Boot
- C# com .NET

Primeiro uso de framework já traz certo nível de integração com boas práticas de modularização, como eu tenho mais experiência com nodejs e java fico em análise essas duas.

Java atende um backend mais robusto e tipagem mais forte com pouca flexibilidade e o que traz mais confiabilidade ao backend, além de ser mais leve e rápido por ser uma linguagem compilada, suas dependências são mais confiáveis que libs do javascript e costumam ser mais fácil de implementar e até mesmo achar no start.spring.io

O nestJS é um framework com um padrão excelente e uma documentação muito boa, fácil de entender e tem boas, resolve problemas com as dependências pela curadoria dos responsáveis, tem um padrão modular já pré-estabelecido que permite criar recursos com poucos comandos de CLI, embora possa pesar muito caso escale o projeto, o nestJS apresenta muito mais caminhos e documentação para um projeto pequeno, por isso vou optar por realizar o projeto teste nele.

Não irei utilizar Express apesar de ser ainda mais leve inicialmente pois o nestJS tem maior integridade com o TypeScript garantido mais segurança e autenticação em tempo de compilação, já possui também injeção de dependência baseada no Spring o que vai me permitir modular melhor.

# 2 - Por que SQL e não NoSQL, Postgres x MySQL e Prisma x TypeORM?

O projeto apresenta clara relação entre as entidades, uma solicitação precisa ser realizada por alguém, além de ser uma relação clara e simples de 1 para N, essa regra de negócio acaba por tornar o NoSQL uma overengineering e tornaria toda a programação inserções, consultas e atualizações penosas, complicadas e ineficientes.

O SQL garante restrições de chaves estrangeiras impedindo dados "orfões" nativamente, garantir isso no NoSQL é bem mais complexo. Também realizar JOINs e agregação é nativo e otimizado, no NoSQL dados precisam ser repetidos e são mais passíveis de falha para isso e extremamente lento. O uso de enum também resolve dados mal formatados.

Postgres é uma escolha muito forte por estar ligado a ferramentas de nuvem, estou criando o projeto visando já o deploy e o Neon me permite uma integração moderna, rápida e simples principalmente em projetos mais reduzidos como esse que podemos nos dar a liberdade de planos gratuitos.

Já o prisma ganha por gerar tipos TypeScript o que reforça nossa ideia de evitar erros em tempo de compilação e escrita de código, junto a isso oferece uma Experiência bastante agradável de desenvolvimento com uma linguagem limpa e legível evitando verbosidade excessiva de decorators do TypeORM.

# 3 - Usar zodvalidation em vez de classes para dto
usando ZodValidarion para criar DTOs também criamos uma "Single Source of Truth", al;ém de validar como fariamos com decorator, tamvém criamos tipo TypeScript junto ao nascimento do schema, o que facilita a escrita e leitura do código e integração com o prisma e diminuindo erros com prisma, caso seja preciso também é muito fácil criar regras personalizadas.
