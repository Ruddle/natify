import Editor, { useMonaco } from "@monaco-editor/react";
// eslint-disable-next-line
import MyWorker from "comlink-loader!./Compute";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Curve from "./Curve";
import Grid from "./Grid";
import InSound from "./InSound";
import RSlider from "./RSlider";
import { mix, smoothstep, useAnimationFrame, useWindowSize } from "./utils";
const qs = require("query-string");
var cloneDeep = require("lodash.clonedeep");

var _ = require("lodash");

// instantiate a new Worker with our code in it:
const worker = new MyWorker();

const tuto1 =
  "?data=eJxtkm9v2jAQxr%2FKya%2BAZvmztZqUjRdosIK0tqxQTVNTTSY5wJtjo9iBAsp335kkdOv2Jr6c7365e54cWaozZDELgmAoVsJyCUaXKgNh4GdpLHAwaEEvwfB8I9H4MGhCKHBToEFlTdPjXk1ZIHDXtxJbVGBFjn6iiD9GutnrElKuIMOlUPgPHeyaendCSlggbCTfYwYLnv4Cq11vok4ouJZ6waUBTsgYhg%2F3g%2Fnk7tYDOkfQubyMwnB98P2uB7PBzfTL6Menu4fbuQffJsPr0XzWYr6%2FniallXUORooMC1jsATNhhVrRXNg2w%2Br08ThRTcL%2FfD%2F62j%2FmQtEsV6EHOX%2BOgUag0FjcUDby3DIprrUkcAzv3F2phI0TNj4krHITSZKi1aEPj0%2BJWuoCOi9pyoYf2vjjX6u16YuLLhwTBRAETnmgmQymWmXGJR3qlO435YETrC6f1djcmU7aL9DukPx7EwEnayNX1Az3WJ9PRLnhdu0boTpOAujV8F6dnk6g99YPuzV%2BWp63SKU2pC45GrqH1Dv3RgJvtSxz%2FM%2BXerS4%2Fz5RJFOBtixUW8A8thPZCq1h8ZG1%2F4GLyQ0Wh37kMXKDxVHoMedFk3PS01%2Fv%2Bv%2Fwhco8tuWyRFd2VXnMrXWmkbUtLDzjXmDjw2uac7nlUVxV1W8WoxpF";
const tuto2 =
  "?data=eJy1lH1v2jAQxr%2FKyX8lkCZOCKTJ2k1Rmw20vq1QTVNTVSm4JVpwImJaVMR33zlvsI52laYhQY6zn99zOp%2BzIuN0wohHDMOYCpHlnmEwrj%2FFP%2BOMTeJIT%2BcPhvxnBPyRJWnGbpXZIo%2FHashD%2Fn1w%2FCUYDfXPl8E3OIQVzGLuQZdqMIuWHpiUYpgLlmGswYLHwoOQ9J9DAuuN2h%2BN%2FKOvGz3VqVkRqG7WgDJbM%2FLfEcfBkf%2FjnwjDq%2BHIH5ztZLyPcBmcBP4weKUK601GyA3jNBJT6LMkY3O4X%2FCxiFOehzxhAsZJNMsQrCw1iDS4U%2BHwI8j9OtIVzJRxzJU7DZaqWqruk0hITymUKrkkhQVNUZawB5EKBih3RaQBHpZZaVmUM6kThULAAehd%2BAQWtPCP%2FHqwZ0IbFBu1RVaVP6U4n6WpmO6yllilrqtZKWapEGJhCctRdX0T8vt0DsomjVn6oY4PYOifXpwEt0fnV2ejOt1uq7AKOeBH6kQ8k6pKYsClPwrK1crounze4Kaigzl2sJjlVqltlemLAUaWTos6pdxobgPs5rUOt5qgYF%2FLGdcKrPqqxtQpthOHBf229LW4uihtKMb9b7A%2FALUQn%2FW0t6Ga2pfwzZ7G5lUjqjshxyGeM7GY83oH0chTPHlgIifeihxfYfMH52cyxjklnryXBKeXeCbViKyyysmbge8jqc%2BSaMymaTJhc9ymkccoWeC7ylxrRJ5Sw8IXTo2iDWyD6j%2B%2FZFlWR%2B%2FRnuM6ju26zr7rNHC700V82YytYmldbVFjXS59o15c7Zg9y3KcXo%2Bavf2O4zYmuGahS9Hp%2F2nioEl1jLts3m1ibkFNG6HV1Oyu3Xp37bbtWGan63bxFNyu49rbPuv1%2BhfpTuiG";
const tuto3 =
  "?data=eJyNVn9P20gQ%2FSojSyeti3EcJ8ZNKD0hCCW6Aj0S7v4gqNokm8Q6x3btDaRF%2Be43s%2Bu1TYDTIZHsj3nvjd%2FMevNszdK5sPrW38PzL4PxyP3r5uvd1QBO4BnWUdIHz4E13%2Fah7UAhRYYLLg43SST7MLEmFuwmicGejv9oAF2vXWJxGNRwz2sQFC8ZzgejsyaFYfAb8PfRF7eDP2t0UKX%2B0fNKfNurwZe%2FXqIvT2%2Bvbq6Htb4RD434uw8%2BvK5RRrXbNCyL%2BUys0ngu8r6%2FzzJJWq0rLldwKeJM5LDYJDMZpUkxSWIhYRbzdYb0bOsAd2Bqw8lnoHgXdRiu6HGUsKkDW9vWqEXMJekTkFC0RUDFxtgWDoHb0AI2VSOHCt0usYIXgnBSISR8AjeA38GHDzih%2Fz4ctuEAWBexatWmDw0u1mkqV29JEy0zeVU7peY62tbxaxXPkZS1XQ9FcOEApjhfH5Nbo3STzGH0M5ErUUTFvmPZJlf5L3LxwwFZG1agSbRYPgilrta%2FDcssZB7xZBm%2FjebTgrEaf4iV9QMbfgPMkQzwVar7k9KVHxv%2BOikjVy9%2Bpg5Hr%2BmxyeUKz5%2F2wXUmjQyUpoZw%2BQ9B5ia%2BLgzDWqtlHTgXs9r6xvOKbcYOO8YjajbEyb3GKTmeVpEUSRrpxqk5cp7M0zXbc8RUMMvTmSiwKsv9EubiUeRT4ppuFguROxDzpaLVc3eR5gM%2BWzEmHIgcSgn3IvQP49A%2Ffh89wMEJfaMorj1gBp7bRVO9MuUiWmexuLgY1yqK5HmSAOrLTZ5AIp5gsZDuWUqx29M85z%2FLWDcWyVKubDQGz9Mjjzc6k6QmAVDLbi54jCIah4kd0%2BbOdlGbYTI7U2LSKDBQy4xOr759HXw%2Fu7m7HmMUPjAwE4dB3rEefYJmoF48OLB1BqqnMVhFtuD2dDw4NuukhM2m5or8kefooGKOkNa8D3FW8WmkarwTUK%2Fbsjuy9InhWxAdsOu4YsUz6gc6j1Xr1tv0vJHczCmkIvHcoCYpVAmrsA%2BaUblHH6Vj9%2FT9QFUsMATbnuFF5OiXEva2ntHNUq7pK04b32rpTmMll0OH2sMgssq8ShfyO3lo%2BsXEUumXiUqN2W4RRzNBJ6RZDvTcR5aym54bSTs0XuY8WxV9uDeLJPWAiVmO9RTNl0IWVv%2FZOr%2FDbIY31zTG97zVpyvFwgNp0YVm0ZEu1%2Bhiwcu8QHzjysEwx1KtiKOdY2kDajbD9RbV%2B0yee%2BS9%2BCNq9LqRpWfSVL8AKnb6BfBuqrjt%2B50j7yjshWG31ws%2F9sKG5utNVKXivmGO35D8T8VuN%2FTbnaAXIGUvCHsNvf0tVKO%2Br9SCyj36lVHqUVVKtctf%2B3IdijPV6IQeMpqjVrGaJwgrxncL4rtH3SAM2p1228NRz6vder2FWnhKX1W%2B%2B38q79e8u93uXw7N8Ns%3D";
const tuto4 =
  "?data=eJyNVX9P20gQ%2FSojSyetiTG2Y%2BPalFZRSY%2FoCrQE7v4gqNokhljn2MbelADKd%2B%2FMrn8RyOkigXdn5703OzO7%2B6LNsnmkhdo%2Fo5M%2Fh1dj8%2B%2BLb9dnQziGF1jGaQiWAUu%2BDsE2oBRRjgYTh6s0FiFMtIkGm0laYwdXf3WApmVXWBx6LdyyOgTla4aT4fhLl6JmcDrw3eivl8MfLdprQv9gWRXetlrw6fNr9Ong8uzifNTq1%2BJ%2BLb5z46PzFlWrut2E5QmfRYssmUdF6GyzTNKDgzMuFnAaJXlUwN0qnYk4S8tJmkQCZglf5kjP1gZwA6Y6HH8C8jdRh6FFjeOUTQ1Y67pC3SVckD4BCUVLBJRsjK1hH7gOB8CmcmRQoe0KG%2FEyIpyQCAEfwfTgMziwhxP6C2Hfhh4wF7HSqtM%2FBS6XWSYW70kTLavjalYqzWW8bv2X0p8jKbNNC0XQ0IMpzpdHlK1xtkrnMH5KxSIq43I7Y%2FmqkPHfFdGDAaJNWIlJImO1EQpd2r%2BPqihEEfP0PnkfzaclYy1%2BHyvreDr8ARgjJcCRoW5Pqqw8rPjboGq51viJOhxzTdumLDd4%2FrgNbiPpRCA1FYSLfwkyr%2F3bwjCstTQrx3k0a1Pf2W%2B0ztl%2Bv84RNRvixFbjVBwFf0wzITdI35Ykzx6ZYxrKjIjAJLDt6NT3amfLPIlKRA6Kgj%2Bx8eDs%2B7fhzy8X1%2BdX6HSXFcBqP3SyjtToI3QdlbHX0%2BFlkgLIUqKz9DyAy8HV8Ki2kxLmuJkXci6nN7g%2FR54EV50H59ZE%2FSGfLRhL5Z4kPYCM6hcvIFYhxRhPfX%2FgrAmEfvI0UqmO6ywR1x7I22qvzRJeIgbEehdWLnhOOaWGbmrfdaDcxWI1J6eGyDK9LlEBveOO455iVasb9SnJpcAl7BmGt7ihTjQ2hprRtdxKYwtQymxPTWUCabiR61U9b%2Bh7S%2F1QIpN6VXAdBYtIrIpU5adyNmh8X%2FB8UYZwUxlv0VsztMd4fh%2BJUgtftJNrrOTo4pzGeN9pIV2tGjamRhe7Rq1d2eiCxUetRHzn6kU3Q%2FvFkxU%2BeLYZWK9%2B9sbQVJgtfU3%2BHvduass8fEuNeeyEbdVxy6exYaencWfsuOw4%2FUPr0A983w0C%2F0PgdzTfLqIqFe6dbDkdyf9UdF3fsfte4CFl4PlBR297CdWooxs1r8kePb%2BVHpWpUjt93pbrk1%2FFj2MkrI9UQ1pvwG8Id9bDMQ9dz%2Ffsvm1bOAqsNlkuUuNpe1Nn9%2F%2FU2WlonM1m8xuqgJbq";
const tuto5 =
  "?data=eJydVmFP4zgQ%2FSujSLdKaUiTtKHbsuwJQe%2BobqEchbsPFJ1M65Lo0iSbuEtZ1P9%2BM3acpKVF6CoRnPG8N%2BM3YzuvxjSZcaNv%2FD08%2F31wO7b%2FGn27uxzACbzCIoz74FiwYKs%2BuBbkgqdosHG4jEPRh4kxMWA9iTX29PaPGtB23AKLQ7%2BCO06NIN9kOB%2BMz%2BoUmsGrwfejf7sZ%2FFmh%2FTL1z45T4F2nAl%2F83ERfnN5cjq6GVXwdvKuD71348KpC6aidumBpxKY8SKIZz%2FrePpbx9elZpbwSrdCvvbH%2BOttGObb0uBrdDsaS8DmciQAXgMkFPHwKBPThCNYAMIkncat1yUQAFzxKeQbzZTwVYRLnkzjiAqYRW6RIYq4sYBY8NuDkK5C%2FjbmZaFHjMDYfLVg1Ggo1j5igjAlIKJoioGQzzRUcAmtAC8xHObKoz9wCy1nOCSckQsAXsH34FTw4wBf668OhC00wO4iV1gY9FDhfJIkIdoUmWlPnVc4UMRfhqvJfSH%2BGpKZrOxgEDU14xPfFMak1TpbxDMYvsQh4HubbiqXLTOY%2Fz%2Fh3C0QlWI4ikbFYCKUu7dfDIguRhSx%2Binaj2WNumhX%2BEHvB8xvwC2COJIAnU91%2BKVT5vmRvk9LhKuNXajDUmpZNKpd49rwNrjKpZSBjKggT%2FxJkpv2rwphYa2lWjjM%2BraSvrZevUvPQ1xpRsyFObDVOwZGx5zgRcoH0vyJJk2fTsy1lRkTPJrDrNajv1coWacRzRN4%2FKMtTxtJAvc6TDEzthS7OsRp9gfHp5fW3wT9no7urW2VsNhvwOokBZCHRWXq24Ob0dnCs7RQHFS7fM%2FleTYeLZSRYzJOl9CS73MQ2ZjJg08A0s%2BTZAnwM4xlXfS2DKnwaimmAQIWJePyE2%2FqwdFeO%2BFbRTZPIAny8oVOEyXyec1qMdsFyyGNKO%2BmFtmiZGEoBjvV0qzWKoxdEL9Il6p%2FLjSMChksVLBN8BgwNAcsB6wMvdHCEcZgHfKYZwjlQkvDpEwjsTvkf9aeLAvUG7Ua%2FunrNE7eakmX8wTIIVQ1DJNCnPb6VldM%2FeYBRd5%2FoxjKlstTj8o45qJoLj34LwsY2PA9YSu1IZ0G5bbadqPVCsZyRY0no2P42YQbNk5rzgWKvPNbVMCfXDF1w%2B5l4H1vqcMQ9pt5It81UMt1oNaa1nFdPuR3uqcYPJxsS02Sxe9Q0tQLGKr4gJjGSZVwss1ipW%2FhaJWneh3ttlAbccWvDMvCyeuIiN%2Fqvxvkd9tVwdEVjvGIMed0ZeBYYdJUbdJoUNroC8TMmR3ztekQ3y%2FjBoiV%2B4rh2x9n4uWvLUMlW9Jp8F%2Fd%2BasfuIBcKXMvT0YnKi7yko6%2BfvcnitOe1j5yjbq%2Fb7fR63c%2B9bi3I20mMShXdIY9XC%2FluxE6n67ltv%2BcjZc%2Fv9uqL2prCaNT%2BZTS%2FlIu%2BsIp4VJci2sXP7XBt8iv4cYyEeh%2BWpHoB3ZJwbwE8%2B6jjd3237boOjnpOJdbbKYyFe%2FVNpTsfqbRX8SKNPADrlfbLSrc%2Fqnq9d6gP5YlNnPJLTamovtSM%2FlHpe38%2FZ1HOrX1PkS33mR%2BsvdgaajfBTuw7sd7B7kHtdimxH0DtSvr%2FwJRYD%2Bv1%2Bj%2FwVtj%2F";
const tuto6 =
  "?data=eJy9WgtT20gS%2FitTqroq2ShCki0beQM5JyiB2gA5ILmrAjYl22OsO1tyJBmcEP77dc9DGr0gm9sLlQWNpvvr5%2FRMj%2FZBm8Yzqo20fx4fvvMvL8xPZ%2B8%2FnvhknzyQVRiNiGWQVbAdEdsgaUbX8MKEx00UZiNyrV1r5PE6krzjy98VRtOyBS88ugW7ZSkAaRnh0L94o0JIBEdhb%2Bc%2BOT79%2FPbc%2F0eB4Obq71mWxLCtAuHoWwVi%2FK%2F%2FFQLZP598fN9kR6%2FZjm0Z4Wh8fnJ2eqx4QvLbeRhag4BO%2BDQ%2Br0dwT2FdL4MpXcTLGU0YQQsUOOPPQQ3aoC4%2BjN%2F4Lcnhlp1S1s1sD%2Ffp2aV%2FUfeRY7Vp57Zq5%2FuHCpBl5THvWa1otmO1BuH49OLy%2FGPDKrL%2FdBA4lG0xsOzrmiLJdJPc0Uqw%2FMvxe9tWfVxfurgOK%2F4dtgk%2B9P0PP4FX88l1tLt7HkSzeEUWdLmmCZlvomkWxlF6HclHks6nPUcPDDIxyNQgsw55uI4I%2FCQ02yRRzkP0fAZ%2FAnJwcLBPrN%2FIJH%2Ba5k8z%2BVQw3AUJycAoPSA7ZNIh30uzAcxMyB8cjHjKzARmpsCiT8nLl6RXZZwiJJtybJhiKkC0OwrJDEhmgGBXWFGbDN7PGiBRYlZ5LxyiZ0yG1SG7pO94fW8wdLyBoAO3wz%2B0NaUUBbMM%2F4NY20N%2FfPja99%2F%2BxqcTCAxMc%2B9bW8%2FvDYfea88ASqffezsY7%2B3h8%2Buhb7v2AMsw4KFV8zghOiKEhLk6JC%2BJ7cLfnZ0OQ9WRanf3JMgW5KgW9yXNyHQZrNbot61BMPAdsn9AkN6ENMNU4M9hpENObDsdzjVfBhmmH4shS5ctY2Rour4lL0iAPtEn7MnAlWULXhqkFPkyxpGByqZLXhGHdGGA%2F43ICxuD3Ade9raDvzhzuorjbNEkGmF1qVc%2BI2Suwm1Bv2L0AYDqtmmBEHgBaQjjFfPWRbyBeFx8jbIFTcO06rH1JmH6zxP6xSBZ4bAUnIQvhSGoOnv%2F4VhokSVhEN0um7mDSarrBf8OVgW3Q%2F5GQEd0gMNUrQ6EV75sgrpSUlzx8gCrBfgazUYv5%2FzBfZW50ETRgMnkLEH2H2SZSfoiMDrEmr3mhDM6LVyv2Eu3a%2F1FT%2FoIkw34skriCIwkuI%2FijBmIfwuQdXyvO1AS2Wvg8Exktp2OtItVmTuoj0m8jhOMopKndyC9mDDAIUWWRkF4R9%2FEq3VC0xSWGcBMNvM5TRi%2FKH4stQJMLT5nJnS2mVJdr6%2BkPMa4GvLBpIMmstLGAWBF%2B8F0oevUIKGBvsBUvQpvQIY4FXYJBRsBs8PqC1f3dhNmQQJKrmgWLCPQed8yB8aM0jUbYAhlVGUYFCPQPosPlbrO4iwTowsLdtfBhNTtTpkG12Ip%2Fpbp7FjmXjdfjiAeXlpGrh04ISAVmBRg8oW07oq103UUsmRnP82L65PaZq2a5kpZBqr103p0YYF2pYNLSj2h1RMe%2FAv16jfr9YRa%2FV%2BhltOslthLE6AYuC%2BArK8k9n2YLY6CZBVH4RQl6WkExWUh36iJLPfkhhxvyHP8ado%2F8%2F1ONgCKNHNJo9ts0RE7rAIuBaDsz%2Bg1Xj1zTljB5rxOni6CNZY1MIqp%2FZnXzSoZFKtlmG1mSFqChIkydUJ29hXyLpdQ0DwqQRFuVw8r0uPvWDkR7maOLMWBBYHzXeHObmBvCG1V38DjPfQfcJ6FIwucYLBHs%2B0bKIFrnVYCIhR4IPMRQVWhCcGTmYH6s5ZEbg5Y5bGaEaj8woBHrJuKvnF0%2B4u17UERdkr6DntlhXs1haW6H%2BJ75xeqW2yVqFGu755d1rfvtir8mi6Xv1BhmATHdtghqNcrudU2PU%2BxQlW%2FVfsLfgxglQP3%2B%2BKAk59egkyXaxDfCboC4lO83KxojnLHhg04CgZozckwUWWypuykL5TS8SgJHjGx7oZzosuOdX8frS9oMV8YcZ3OUemKkJS5ZHQKbzM3q0vt0ahMutjSqAR8%2FqauQu%2F%2FpQJbYj%2BkQv%2FXeMF5VknnKS1dqaU8mdcoBs12SPrnLXg%2BkE8pOFTFY01tSbo9lQ5rQwudV8Jje4qkrCe8JYmbNnBRHeQ9jHlLM7XXsi2CJytsuqBFEceHqgC7TUBJBD9J6%2BImxyD8BqbDeTJ55t7tdq%2BjLvHvguUmgNYjZT0jaxawPYzncE5iPUmA56xb6CUikoVYC7rk7%2BsgCVbk4WzybzrNHonoXfCPOh1tVhOa8GlzHWbTBRDxv2FEjr6ZrcQpGJBdgjRgYM9MNHKldBpHs7SdlR9wgG%2B2SQJ21fMMV8bFTDdJQqNGQbvKBRMFf52CHNavGYy6o%2FYh7BqGI5Yt4SQYUbwwsMj370B7QNhVNW%2BHu6oBndq%2BIi9v5CkQK7Xi2S6RN8bFCUwekGASul19fPm7KOvQ0vKREK8I5tyPeI3wjkY0wdzA6ZRkC0gFnia3cTwjWQw5vKCJ4p1bwYEeSvWSY9ZxmoaTJT3Z4D6sFABbWe6O8txTn1mJKsZ9GKvzvEKUx%2Br8AMauMh7CeKCM92A8vOHjsqLKyEyXIbTG4mYcemB%2Br92p2%2FieeRIP%2B1f8LNG%2FqRNdrINpyA59DUTc4%2FtknCTBV51dUStyiuWRNwOsEcA5pRFgbPWTPkugVdW6K3YQmS%2FjONH5xRveLSjWi7y8URKTgwjqA7b%2FvOJvR%2ByGZpcNypKXQYprJMQyR%2FBWlbwqNwDM9Cs2fyNye1Sm4L3alyTT8%2B8scL4SX22qDSAD2OdiuxV9cDVyggOSQ8HC5O9eFphlmEazeNnZr%2BbAk24VNA2uZVHOE6SSMk9iCpoGTOHYG3YXzwwyikwypAVKf1WkGbRkUpsuYR9hmvpfJiDvwmQKV2rCdQR1NY2XUG%2FiW%2F1aY0l6rRmcPr%2F2ggZQWQAX45MP7%2F3Pb84%2Bnl52xK2xpOP5zp5eEpWQv1SSX9ZnRrtLzseXvlJT02IxpWiwsEY6gx35I3ZPm28BWCuVfKtfnvGvAwKU23SFfzEG3FOVWzpdUHXyw%2Fa7JFhjXl3dKHbjIsfvS5a8Mrds%2FtxgbYj3iTBrWsX7O7F%2F2AY7fAykikKcud6kC%2F2O7wOyrSlZIWrnLVKnI3IlX%2BcQoO2jZmj34Qw2iVQbPWiHH8Hhx2en%2BLwKI22EH3m0VbDVRtBVaXhDI97hhx9tpKXAr3wVAjJDw9MK1UY9s2eVfnqPhsZvFwt4Cd6E3Q5tmR5gweao6GlJRdmnqhwOP0G3KgvTjtMbWIOhNxz2PW%2B45w0VIZZdscAGqbgbN7jHUUQ%2BKbHfHzp2z%2FVckOe5Q0%2BRNxgCvqxnuQw3dxJ%2BlRZSMBpCxtG3qhD8kilR7b6FoKJw%2FkWggwGCyrNMgzd6jd7Y1r3h9odDx3HdoWu59mDgFHqDAHk3lgvIczHPl%2FZsgfRDwP7Qs3qu28%2BBpY%2FhVFBLw73nYQsnSL%2F%2BJNCg8CYAsXrdnM3uj2aWuj7Qfaxq13znWM%2Fr5uZILurm%2B4cFDH4xF1HoWT%2BAxb6d51F12Bri%2FVK9CvxAWJXMtnIk20Is%2FGIOHOyDuZaTPWhBAnxXuNZdvFyG6oB5h7%2F73g%2F87g%2FcgePegI78f5%2BZbibhVHvE6PPu7alqhqWozRJTrTVDl9UW7AJ%2FGq%2BcAIB3R5MUjvywGDyoM2GKe9gmozNtNA%2BWKWXkIYyyZEMf%2FwtPrUHA";
const tuto7 =
  "?data=eJx9kUFLw0AQhf%2FKMCelS0niyVUPpS0S0FZsi4ckSGimbSDZhN1NVdL8dyc1TaGoe9nh7ffeDLM1rouEUOKbP3mcLhdDf7aYr2YTeIAa7FdJEkI0RaWSEKEJ1QXm%2FcWFKiMLJs7LjAxDQRSqTaHh6iyz6tyd6ntYjJ5fnqbvY45dnuTB4BrqUAGfLir4uSM2dyP0yuEAzu%2FsoIe9C5on1WQrraDuTAK2Oi53RkJwUjqv6EOiBgV%2BpMmWrEFZ42T1Olr681lb56lC6QxdgXn8idJ1BBpLZadVKrW8bMP%2BMovXtCuyhDRjAvdxVvFHuI3Ark8b1662NbSbxR4KojPl%2FYsxtydt0oKncm9uj09pgtLqigSmZlzkZWWJlU2cGWq%2BAbM7qYk%3D";
//ADD MOUSE DRAWING WIDGET FOR REPLACING PURE SIN WITH OTHER PERIODIC FUNCTION
//ADD SELECT WIDGET

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Array} buffer
 */
function drawBuffer(canvas, buffers, dstate) {
  let ctx = canvas.getContext("2d");

  for (let bufferIndex = 0; bufferIndex < buffers.length; bufferIndex++) {
    let buffer = buffers[bufferIndex];
    let h = canvas.height;
    let w = canvas.width / buffers.length;

    ctx.resetTransform();
    ctx.translate(bufferIndex * w, 0.0);

    let scale = 1;
    if (dstate.trans) {
      let t = dstate.trans[bufferIndex];
      if (t && false) {
        scale = t.scale;
        ctx.translate(t.x, t.y);
        ctx.scale(scale, scale);
        ctx.translate(-t.x, -t.y);
      }
    } else {
      console.log("no dstate");
    }

    ctx.width = w;
    ctx.height = h;

    ctx.clearRect(0, 0, w, h);

    if (
      buffer === undefined ||
      (!Array.isArray(buffer) && buffer.constructor !== Float32Array) ||
      buffer.length < 2
    ) {
      ctx.fillStyle = "rgb(30,70,70)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgb(70,0,0)";
      ctx.fillRect(1, 1, w - 1, h - 1);
      continue;
    } else {
      ctx.fillStyle = "rgb(30,30,30)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgb(30,70,70)";
      if (bufferIndex < buffers.length - 1) ctx.fillRect(w - 1, 0, 1, h);
    }

    let minY = buffer.reduce((prev, curr) => (curr < prev ? curr : prev));
    let maxY = buffer.reduce((prev, curr) => (curr > prev ? curr : prev));
    let split = maxY - minY;

    maxY += split * 0.1;
    minY -= split * 0.1;

    function vToH(v) {
      return h - ((v - minY) / (maxY - minY)) * h;
    }
    function iToV(i) {
      return 10 + (i / (buffer.length - 1)) * (w - 20);
    }
    ctx.strokeStyle = "#977";
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    ctx.moveTo(0, vToH(0));
    ctx.lineTo(w, vToH(0));

    let mol = Math.ceil(vToH(-1)) + 0.5;
    ctx.moveTo(0, mol);
    ctx.lineTo(w, mol);

    let pol = Math.floor(vToH(1)) - 0.5;
    ctx.moveTo(0, pol);
    ctx.lineTo(w, pol);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(iToV(0), vToH(buffer[0]));
    for (var i = 0; i < buffer.length; i++) {
      let v = buffer[i];
      ctx.lineTo(iToV(i), vToH(v));
    }

    ctx.strokeStyle =
      bufferIndex % 2 === 0 ? "rgb(96, 197, 177)" : "rgb(100, 153, 211)";
    ctx.lineWidth = 1 / scale;
    ctx.stroke();
  }
}

function hashCode(s) {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};

async function b64ToSetting(b64) {
  if (b64) {
    let {
      code,
      widgets = {},
      appVersion = 0,
    } = await worker.compressedB64ToObj(b64);
    if (appVersion === 0) {
      // code = { main: code };
    }
    return { code, widgets, appVersion, version: 10 };
  }
  return null;
}

function handleMouse(dstate, graphs, w, h, nx, ny, scroll) {
  let redraw = false;
  if (!dstate.trans || dstate.trans.length !== graphs.length) {
    dstate.trans = [];
    for (let i = 0; i < graphs.length; i++) {
      dstate.trans.push({ scale: 1, x: w / 2, y: h / 2 });
    }
  }

  if (nx != null && ny != null) {
    dstate.x = nx;
    dstate.y = ny;
  }

  if (scroll != null) {
    redraw = true;
    let transIndex = Math.floor((graphs.length * dstate.x) / w);
    let t = dstate.trans[transIndex];

    t.x = dstate.x;
    t.y = dstate.y;

    t.scale *= 1 + scroll * 0.2;
    t.scale = Math.max(1, t.scale);
  }
  return redraw;
}

export default function EditorFrag() {
  const monaco = useMonaco();

  const wsize = useWindowSize();
  const [astate, setAstate] = useState();

  const [setting, setSetting] = useState({
    code: "return Array.from(Array(SAMPLE_COUNT).keys()).map(e => 0.0)",
    widgets: {},
    isComputed: false,
    version: 0,
  });

  const currentVersion = useRef(0);
  useEffect(() => (currentVersion.current = setting.version), [setting]);

  const waveformCanvasRef = useRef();
  const waveformState = useRef({ cursor: 0, end: 1, loudness: [0, 0, 0] });
  useAnimationFrame((deltaTime) => {
    let state = waveformState.current;
    let canvas = waveformCanvasRef.current;
    if (state && canvas) {
      state.cursor += deltaTime;
      let { cursor, end, loudness } = state;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (cursor < end) {
        ctx.lineWidth = (0.5 * canvas.width) / loudness.length;

        let opacity =
          smoothstep(0, 0.1, cursor / end) - smoothstep(0.9, 1, cursor / end);
        ctx.fillStyle = "rgba(40,40,40," + opacity + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        for (let i = 0; i < loudness.length; i++) {
          let x = (canvas.width * i) / loudness.length;
          let y = (loudness[i] * canvas.height * 0.9) / 2;
          ctx.moveTo(x, canvas.height / 2 - y);
          ctx.lineTo(x, canvas.height / 2 + y);
        }

        //rgba(86,156,214

        ctx.strokeStyle = "rgba(206,145,120," + opacity + ")";
        ctx.stroke();

        //cursor
        ctx.beginPath();
        let x = (canvas.width * cursor) / end;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        //rgb(86 156 214)
        let s = smoothstep(0, 1, 1.0 - cursor / end);
        let r = mix(86, 61, s);
        let g = mix(156, 201, s);
        let b = mix(214, 176, s);
        ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
        ctx.stroke();

        //border
        ctx.beginPath();

        ctx.moveTo(0.0, 0.5);
        ctx.lineTo(0.0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, 0.5);
        ctx.lineTo(0.0, 0.5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(206,145,120," + opacity + ")";
        ctx.stroke();
      }
    }
  });

  const dstate = useRef({});

  const ReDrawBuffer = useCallback(() => {
    let codeResult = astate?.codeResult;
    if (codeResult)
      drawBuffer(canvasRef.current, codeResult.graphs, dstate.current);
  }, [astate]);

  useEffect(() => {
    ReDrawBuffer();
  }, [wsize]);

  const [refreshIsPossible, setRefreshIsPossible] = useState(true);

  const [computeTime, setComputeTime] = useState(0);

  const waitingForWorker = useRef(false);
  function setWaiting(b) {
    waitingForWorker.current = b;
  }

  useEffect(() => {
    async function getInitialData() {
      let data = getQueryStringValue("data");
      if (data) {
        let sets = await b64ToSetting(data);
        setSetting(sets);
      } else {
        loadPreset(tuto3);
      }
    }
    getInitialData();
  }, []);

  function loadPreset(preset) {
    async function getData(preset) {
      let data = getQueryStringValue("data", preset);
      if (data) {
        let sets = await b64ToSetting(data);
        setSetting(sets);
      }
    }
    getData(preset);
  }

  const canvasRef = useRef();

  useEffect(() => {
    async function test() {
      const version = currentVersion.current;
      let res = await worker.testSetting(cloneDeep(setting));

      console.log("computed widgets, ", res.widgets);

      if (
        res &&
        res.widgets &&
        (!_.isEqual(res.widgets, setting.widgets) ||
          setting.valid !== res.valid)
      ) {
        console.log("set Widgets and valid after test");
        setSetting((old) => {
          if (old.version === version)
            return { ...old, widgets: res.widgets, valid: res.valid };
          else return old;
        });
      }
    }
    test();
  }, [setting]);

  useEffect(() => {
    console.log("Setting effect", setting);
  }, [setting]);

  let dimOld = useCallback(() => {
    if (astate.gainNode) {
      try {
        let duration = 0.05;
        let N = (astate.audioCtx.sampleRate * duration) / 100.0;
        var waveArray = new Float32Array(N);
        for (var i = 0; i < N; i++) {
          waveArray[i] = Math.pow(1.0 - i / (N - 1), 2);
        }
        astate.gainNode.gain.setValueCurveAtTime(
          waveArray,
          astate.audioCtx.currentTime,
          0.05
        );
      } catch {
        astate.source.stop();
      }
    }
  }, [astate]);

  const [exportedWav, setExportedWav] = useState(null);
  const exportWav = useCallback(async () => {
    if (astate && astate.codeResult && astate.codeResult.samples?.length > 0) {
      setExportedWav("loading");
      let b64file = await worker.exportWav(
        astate.audioCtx.sampleRate,
        astate.codeResult.samples
      );
      setExportedWav(b64file);
    }
  }, [astate]);

  let compute = useCallback(async () => {
    if (astate && astate.audioCtx && setting.valid === true) {
      dimOld();

      console.log("compute: Start compute");
      let duration = setting.widgets?.DURATION?.value || 1.0;
      let N = Math.ceil(astate.audioCtx.sampleRate * duration);

      let codeResult = null;
      try {
        setWaiting(true);
        let start = performance.now();
        setExportedWav(null);

        console.log("compute: cloning");
        let clone = cloneDeep(setting);

        console.log("compute: sending: ", clone);
        codeResult = await worker.computeSetting(
          clone,
          N,
          astate.audioCtx.sampleRate
        );
        let end = performance.now();
        setComputeTime(end - start);
        console.log("compute: took ", end - start + "ms");

        let test = codeResult.samples[0];
      } catch (e) {
        console.error("compute: Crash try, ", e);
        return;
      } finally {
        setTimeout(() => {
          setWaiting(false);
          setRefreshIsPossible(true);
        }, 100);
      }

      async function saveSetting() {
        let settingClone = cloneDeep(setting);
        Object.keys(settingClone.widgets).forEach((k) => {
          if (settingClone.widgets[k].type === "sound")
            settingClone.widgets[k].value = [];
        });
        let str = await worker.objToCompressedB64(settingClone);
        setQueryStringValue("data", str);
      }
      saveSetting();

      var myArrayBuffer = astate.audioCtx.createBuffer(
        1,
        N,
        astate.audioCtx.sampleRate
      );

      for (
        var channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);

        for (var i = 0; i < myArrayBuffer.length; i++) {
          nowBuffering[i] = codeResult.samples[i];
        }
      }

      let source = astate.audioCtx.createBufferSource();
      source.buffer = myArrayBuffer;

      var gainNode = astate.audioCtx.createGain();
      gainNode.gain.value = 1.0;
      source.connect(gainNode);
      gainNode.connect(astate.audioCtx.destination);

      //   source.connect(astate.audioCtx.destination);
      source.start();

      codeResult.graphs = codeResult.graphs || [codeResult.samples] || [];
      // graphs.push(codeResult.loudness);
      waveformState.current = {
        cursor: 0,
        end: duration * 1000,
        loudness: codeResult.loudness,
      };

      drawBuffer(canvasRef.current, codeResult.graphs, dstate.current);

      setAstate((old) => {
        return {
          ...old,
          source,
          gainNode,

          codeResult,
        };
      });
    }
  }, [astate, setting, dimOld]);

  const play = useCallback(() => {
    let codeResult = astate.codeResult;
    if (codeResult) {
      dimOld();
      let duration = setting.widgets?.DURATION?.value || 1.0;
      let N = Math.ceil(astate.audioCtx.sampleRate * duration);

      var myArrayBuffer = astate.audioCtx.createBuffer(
        1,
        N,
        astate.audioCtx.sampleRate
      );

      for (
        var channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);

        for (var i = 0; i < myArrayBuffer.length; i++) {
          nowBuffering[i] = codeResult.samples[i];
        }
      }

      let source = astate.audioCtx.createBufferSource();
      source.buffer = myArrayBuffer;

      var gainNode = astate.audioCtx.createGain();
      gainNode.gain.value = 1.0;
      source.connect(gainNode);
      gainNode.connect(astate.audioCtx.destination);

      //   source.connect(astate.audioCtx.destination);

      source.start();
      waveformState.current = {
        cursor: 0,
        end: duration * 1000,
        loudness: codeResult.loudness,
      };
      setAstate((old) => {
        return { ...old, source, gainNode };
      });
    }
  }, [astate, dimOld]);

  useEffect(() => {
    if (refreshIsPossible) {
      if (
        setting.valid === true &&
        !waitingForWorker.current &&
        !setting.isComputed
      ) {
        setSetting((old) => {
          return { ...old, isComputed: true };
        });
        compute();
      } else if (setting.valid === true && waitingForWorker.current) {
        setRefreshIsPossible(false);
      }
    }
  }, [compute, astate, setting, refreshIsPossible]);

  useEffect(() => {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    setAstate({ audioCtx });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "rgb(62, 62, 62)",
        height: window.innerHeight,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "rgb(62, 62, 62)",
          flex: "1 1 auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 60 auto",
            margin: "5px",
            marginRight: "0px",
            padding: "10px",
            background: "rgb(30 30 30)",
            borderRadius: "3px",

            overflow: "hidden",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <button
              style={{
                padding: "10px",
                marginRight: "5px",
                fontSize: "0.8em",
                cursor: "pointer",
                backgroundColor: "#3dc9b0",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => {
                play();
              }}
            >
              Play
            </button>
            <button
              style={{
                padding: "10px",
                marginRight: "5px",
                cursor: "pointer",
                fontSize: "0.8em",
                backgroundColor: "#3dc9b0",
                border: "none",
                borderRadius: "3px",
              }}
              onClick={() => {
                compute();
              }}
            >
              Compile
            </button>
            {exportedWav && exportedWav !== "loading" && (
              <a
                href={exportedWav}
                download="exported_sound.wav"
                target="_blank"
                style={{
                  padding: "10px",
                  fontSize: "0.8em",
                  cursor: "pointer",
                  backgroundColor: "#569cd6",
                  border: "none",
                  borderRadius: "3px",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                Download exported
              </a>
            )}
            {exportedWav === "loading" && (
              <div
                style={{
                  padding: "10px",
                  fontSize: "0.8em",

                  backgroundColor: "#569cd6",
                  border: "none",
                  borderRadius: "3px",
                }}
              >
                Loading
              </div>
            )}
            {!exportedWav && (
              <button
                style={{
                  padding: "10px",
                  fontSize: "0.8em",
                  cursor: "pointer",
                  backgroundColor: "#3dc9b0",
                  border: "none",
                  borderRadius: "3px",
                }}
                onClick={() => {
                  exportWav();
                }}
              >
                Export
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <div
              style={{ color: "grey", fontSize: "0.8em", marginRight: "3px" }}
            >
              Tutorial/demo
            </div>
            {[
              ["1", tuto1],
              ["2", tuto2],
              ["3", tuto3],
              ["4", tuto4],
              ["5", tuto5],
              ["6", tuto6],
              ["7", tuto7],
            ].map(([name, tuto]) => (
              <button
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  marginRight: "3px",
                  backgroundColor: "#099",
                  border: "none",
                  borderRadius: "3px",
                }}
                onClick={() => loadPreset(tuto)}
              >
                {name}
              </button>
            ))}
          </div>
          <div
            style={{
              fontSize: "0.8em",
              marginTop: "10px",
              color: "white",
              textAlign: "left",
            }}
          >
            <div> Write your sound function on the right !</div>
            <div>
              The samples you return will be played on your speaker, and the
              graphs your return plotted.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flex: "1 1 auto",
              marginTop: "20px",
              flexWrap: "wrap",
              overflowY: "auto",
            }}
          >
            {Object.keys(setting.widgets)
              .map((p) => {
                return { name: p, ...setting.widgets[p] };
              })
              .map((p) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    userSelect: "none",
                  }}
                >
                  {p.min != null && (
                    <RSlider
                      name={p.name}
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={p.value}
                      unit={p.unit}
                      onChange={(v) =>
                        setSetting((old) => {
                          let obj = cloneDeep(old.widgets);
                          obj[p.name].value = v;
                          return {
                            ...old,
                            widgets: obj,
                            isComputed: false,
                            version: old.version + 1,
                          };
                        })
                      }
                    ></RSlider>
                  )}
                  {p.width != null && (
                    <Grid
                      name={p.name}
                      value={p.value}
                      onChange={(newGrid) => {
                        setSetting((old) => {
                          let obj = cloneDeep(old.widgets);
                          try {
                            obj[p.name].value = newGrid;
                          } catch {}
                          return {
                            ...old,
                            widgets: obj,
                            isComputed: false,
                            version: old.version + 1,
                          };
                        });
                      }}
                    ></Grid>
                  )}
                  {p.type === "curve" && (
                    <Curve
                      name={p.name}
                      value={p.value}
                      onChange={(newGrid) => {
                        setSetting((old) => {
                          let obj = cloneDeep(old.widgets);
                          try {
                            obj[p.name].value = newGrid;
                          } catch {}
                          return {
                            ...old,
                            widgets: obj,
                            isComputed: false,
                            version: old.version + 1,
                          };
                        });
                      }}
                    ></Curve>
                  )}
                  {p.type === "sound" && (
                    <InSound
                      name={p.name}
                      value={p.value}
                      onChange={(newGrid) => {
                        setSetting((old) => {
                          let obj = cloneDeep(old.widgets);
                          try {
                            obj[p.name].value = newGrid;
                          } catch {}
                          return {
                            ...old,
                            widgets: obj,
                            isComputed: false,
                            version: old.version + 1,
                          };
                        });
                      }}
                    ></InSound>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div
          style={{
            flex: "1 1 auto",
            margin: "5px",
            padding: "0px",
            background: "rgb(30 30 30)",
            minWidth: "677px",
            borderRadius: "3px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Editor
            height="60vh"
            defaultLanguage="javascript"
            defaultValue={setting.code}
            value={setting.code}
            onChange={(v, e) =>
              setSetting((old) => {
                return {
                  ...old,
                  code: v,
                  valid: undefined,
                  isComputed: false,
                  version: old.version + 1,
                };
              })
            }
            theme="vs-dark"
            options={{
              fontSize: "12",
            }}
          />
          <div
            style={{
              color: "grey",
              fontSize: "0.7em",
              textAlign: "right",
              position: "absolute",
              bottom: "0px",
              right: "0px",
            }}
          >
            {Math.floor(computeTime) + " ms"}
          </div>
        </div>
      </div>

      <div
        style={{
          margin: "0px 5px 5px 5px",
          padding: "0px",
          flex: "none",

          height: Math.floor(wsize.height * 0.35) + "px",
          position: "relative",
        }}
      >
        <div style={{ borderRadius: "3px", overflow: "hidden" }}>
          <canvas
            onMouseMove={(e) => {
              var rect = e.target.getBoundingClientRect();
              var x = e.clientX - rect.left; //x position within the element.
              var y = e.clientY - rect.top; //y position within the element.
              if (astate?.codeResult) {
                let redraw = handleMouse(
                  dstate.current,
                  astate.codeResult.graphs,
                  wsize.width - 10,
                  Math.floor(wsize.height * 0.35),
                  x,
                  y
                );
              }
            }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              if (astate?.codeResult) {
                let redraw = handleMouse(
                  dstate.current,
                  astate.codeResult.graphs,
                  wsize.width - 10,
                  Math.floor(wsize.height * 0.35),
                  null,
                  null,
                  e.button === 0 ? 1 : -1
                );
                if (redraw) ReDrawBuffer();
              }
            }}
            ref={canvasRef}
            width={wsize.width - 10}
            height={Math.floor(wsize.height * 0.35)}
            // style={{ width: "100%", minHeight: "50px" }}
          ></canvas>
        </div>

        <canvas
          style={{
            position: "absolute",
            left: "50%",
            top: "0px",
            transform: "translate(-50%,-50%)",
            borderRadius: "0px",
            overflow: "hidden",
          }}
          width={wsize.width / 4}
          height={Math.floor(wsize.height * 0.05)}
          ref={waveformCanvasRef}
        ></canvas>
      </div>
    </div>
  );
}
