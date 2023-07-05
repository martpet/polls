import { Handlers } from "$fresh/server.ts";

import { EMAIL } from "🛠️/constants.ts";

import { DELETE_ME_PATH, ME_PATH } from "🛠️/paths.ts";
import Link from "🧱/Link.tsx";
import Quotes from "🧱/Quotes.tsx";
import View from "🧱/View.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const res = await ctx.render();
    res.headers.set("Cache-Control", `public, max-age=${60 * 60 * 24}`);
    return res;
  },
};

export default function PrivacyPolicyPage() {
  return (
    <View headline="Политика за поверителност" width="sm">
      <p>
        <small class="italic">Последна промяна: 10 юли 2023 г.</small>
      </p>
      <p>
        <Quotes>Гласуване</Quotes>{" "}
        е хоби проект на анонимен български програмист. На тази страница ще Ви
        разясня как използвам Вашите лични данни, които събирам от Вас, докато
        Вие използвате сайта.
      </p>
      <h2>Каквa информация събирам?</h2>
      <ul>
        <li>
          Вашият <strong>Google ID</strong>.
        </li>
        <li>
          За кого е гласувано с този <strong>Google ID</strong>.
        </li>
        <li>
          Телефонен номер — записва се отделно от Вашия{" "}
          <strong>Google ID</strong> и не може да се асоциира с Вас.
        </li>
      </ul>
      <h2>Как събирам информацията?</h2>
      <p>
        След натискане на бутона <Quotes>Разреши достъп</Quotes>{" "}
        <Quotes>Гласуване</Quotes> Ви препраща към{"  "}
        <Quotes>Google</Quotes>, където Вие разрешавате на{" "}
        <Quotes>Google</Quotes> да сподели информацията.
      </p>
      <h2>Как използвам Вашата информация?</h2>
      <p>
        Данните служат само за нуждите на сайта:
      </p>
      <ul>
        <li>
          Обвързването на Вашия <strong>Google ID</strong>{" "}
          с вашите гласувания Ви дава възможност да променяте вота си.
        </li>
        <li>
          Предоставянето на <strong>телефонен номер</strong>{" "}
          ограничава фалшивото гласуване, тъй като сайтът не позволява да се
          гласува от друг профил със същия телефонен номер.
        </li>
      </ul>
      <h2>Как съхранявам Вашата информация?</h2>
      <p>
        Данните се съхраняват криптирани на{" "}
        <a href="https://deno.com/deploy/docs/regions">
          сървърите на <Quotes>Deno Land Inc</Quotes>
        </a>. Връзката между Вас и <Quotes>Deno Land Inc</Quotes>{" "}
        също е криптирана.
      </p>
      <p>
        Информацията се пази за неопределен срок от време.
      </p>
      <h2>Какви са Вашите права над информацията Ви?</h2>
      <ul>
        <li>
          <strong>Право на достъп</strong> — можете да{" "}
          <Link href={ME_PATH}>разгледате</Link>{" "}
          каква информация сайтът съхранява за вас.
        </li>
        <li>
          <strong>Право на изтриване</strong> — можете да{" "}
          <Link href={DELETE_ME_PATH}>изтриете</Link> личните Ви данни.
        </li>
      </ul>
      <h2>
        Какво са <Quotes class="not-italic">бисквитки</Quotes>?
      </h2>
      <p>
        Бисквитките са текстови файлове, които сайтът слага на Вашия компютър,
        за да може да Ви разпознае.
      </p>
      <h2>
        Как този сайт използва <Quotes class="not-italic">бисквитки</Quotes>?
      </h2>
      <p>
        Сайтът записва в бисквитка, че сте се логнали с Гугъл и така не ви кара
        да се логвате отново. Бисквитката се изтрива, когато затворите браузъра.
      </p>
      <h2>Как да се свържете с мен?</h2>
      <p>
        Пишете на <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </View>
  );
}
